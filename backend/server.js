const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const Student = require("./models/Student");
const Room = require("./models/Room");
const Booking = require("./models/Booking");
const Admin = require("./models/Admin");

const app = express();

app.use(cors());
app.use(express.json());

// =====================================
// FILE UPLOAD SETUP
// =====================================

const uploadDir = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + file.originalname;

    cb(null, uniqueName);
  },
});

const upload = multer({
  storage: storage,
});

// Make uploaded files accessible
app.use(
  "/uploads",
  express.static(uploadDir)
);

// =====================================
// HOME
// =====================================

app.get("/", (req, res) => {
  res.send("SmartHostel Backend is running 🚀");
});

// =====================================
// STUDENT REGISTER
// =====================================

app.post(
  "/api/students/register",
  async (req, res) => {
    try {
      const {
        name,
        rollNumber,
        email,
        password,
        phone,
        course,
        year,
      } = req.body;

      if (
        !name ||
        !rollNumber ||
        !email ||
        !password
      ) {
        return res.status(400).json({
          message:
            "Name, Roll Number, Email and Password are required",
        });
      }

      const existingStudent =
        await Student.findOne({
          $or: [
            { email: email },
            { rollNumber: rollNumber },
          ],
        });

      if (existingStudent) {
        return res.status(400).json({
          message:
            "Student with this email or roll number already exists",
        });
      }

      const hashedPassword =
        await bcrypt.hash(password, 10);

      const student =
        new Student({
          name,
          rollNumber,
          email,
          password: hashedPassword,
          phone,
          course,
          year,
        });

      const savedStudent =
        await student.save();

      res.status(201).json({
        message:
          "Student registered successfully ✅",

        student: {
          id: savedStudent._id,
          name: savedStudent.name,
          rollNumber:
            savedStudent.rollNumber,
          email: savedStudent.email,
          phone: savedStudent.phone,
          course: savedStudent.course,
          year: savedStudent.year,
          bookingStatus:
            savedStudent.bookingStatus,
        },
      });
    } catch (error) {
      console.error(
        "Registration Error:",
        error
      );

      res.status(500).json({
        message:
          "Registration failed ❌",
        error:
          error.message,
      });
    }
  }
);

// =====================================
// STUDENT LOGIN
// =====================================

app.post(
  "/api/students/login",
  async (req, res) => {
    try {
      const {
        email,
        password,
      } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          message:
            "Email and Password are required",
        });
      }

      const student =
        await Student.findOne({
          email,
        });

      if (!student) {
        return res.status(401).json({
          message:
            "Invalid email or password",
        });
      }

      const isPasswordCorrect =
        await bcrypt.compare(
          password,
          student.password
        );

      if (!isPasswordCorrect) {
        return res.status(401).json({
          message:
            "Invalid email or password",
        });
      }

      res.status(200).json({
        message:
          "Login successful ✅",

        student: {
          id: student._id,
          name: student.name,
          rollNumber:
            student.rollNumber,
          email: student.email,
          phone: student.phone,
          course: student.course,
          year: student.year,
          hostel: student.hostel,
          roomNumber:
            student.roomNumber,
          bookingStatus:
            student.bookingStatus,
        },
      });
    } catch (error) {
      console.error(
        "Login Error:",
        error
      );

      res.status(500).json({
        message:
          "Login failed ❌",
        error:
          error.message,
      });
    }
  }
);

// =====================================
// CREATE ADMIN
// =====================================

app.post(
  "/api/admin/create",
  async (req, res) => {
    try {
      const {
        name,
        email,
        password,
      } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({
          message:
            "Name, Email and Password are required",
        });
      }

      const existingAdmin =
        await Admin.findOne({ email });

      if (existingAdmin) {
        return res.status(400).json({
          message:
            "Admin already exists",
        });
      }

      const hashedPassword =
        await bcrypt.hash(password, 10);

      const admin = new Admin({
        name,
        email,
        password: hashedPassword,
      });

      const savedAdmin =
        await admin.save();

      res.status(201).json({
        message:
          "Admin created successfully ✅",

        admin: {
          id: savedAdmin._id,
          name: savedAdmin.name,
          email: savedAdmin.email,
        },
      });
    } catch (error) {
      console.error(
        "Admin Creation Error:",
        error
      );

      res.status(500).json({
        message:
          "Admin creation failed",
        error:
          error.message,
      });
    }
  }
);

// =====================================
// ADMIN LOGIN
// =====================================

app.post(
  "/api/admin/login",
  async (req, res) => {
    try {
      const {
        email,
        password,
      } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          message:
            "Email and Password are required",
        });
      }

      const admin =
        await Admin.findOne({
          email,
        });

      if (!admin) {
        return res.status(401).json({
          message:
            "Invalid admin email or password",
        });
      }

      const isPasswordCorrect =
        await bcrypt.compare(
          password,
          admin.password
        );

      if (!isPasswordCorrect) {
        return res.status(401).json({
          message:
            "Invalid admin email or password",
        });
      }

      res.status(200).json({
        message:
          "Admin login successful ✅",

        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
        },
      });
    } catch (error) {
      console.error(
        "Admin Login Error:",
        error
      );

      res.status(500).json({
        message:
          "Admin login failed",
        error:
          error.message,
      });
    }
  }
);

// =====================================
// CREATE STUDENT
// =====================================

app.post(
  "/api/students",
  async (req, res) => {
    try {
      const student =
        new Student(req.body);

      const savedStudent =
        await student.save();

      res.status(201).json(
        savedStudent
      );
    } catch (error) {
      res.status(400).json({
        message:
          "Student creation failed",
        error:
          error.message,
      });
    }
  }
);

// =====================================
// CREATE ROOM
// =====================================

app.post(
  "/api/rooms",
  async (req, res) => {
    try {
      const room =
        new Room({
          ...req.body,
          capacity: 1,
        });

      const savedRoom =
        await room.save();

      res.status(201).json(
        savedRoom
      );
    } catch (error) {
      res.status(400).json({
        message:
          "Room creation failed",
        error:
          error.message,
      });
    }
  }
);

// =====================================
// GET ROOMS
// =====================================

app.get(
  "/api/rooms",
  async (req, res) => {
    try {
      const rooms =
        await Room.find({
          hostelName:
            "Hostel A",
          floor: 1,
        }).sort({
          roomNumber: 1,
        });

      // =================================
      // SYNC ROOM STATUS WITH BOOKINGS
      // =================================

      for (const room of rooms) {

        // Force single occupancy
        if (room.capacity !== 1) {
          room.capacity = 1;
        }

        // Maintenance rooms stay untouched
        if (room.status === "Maintenance") {
          await room.save();
          continue;
        }

        const activeBooking =
          await Booking.findOne({
            hostelName:
              room.hostelName,

            floor:
              room.floor,

            roomNumber:
              room.roomNumber,

            status: {
              $in: [
                "Pending",
                "Confirmed",
              ],
            },
          });

        if (activeBooking) {
          room.occupied = 1;
          room.status = "Full";
        } else {
          room.occupied = 0;
          room.status = "Available";
        }

        await room.save();
      }

      res.status(200).json(
        rooms
      );
    } catch (error) {
      console.error(
        "Room Fetch Error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to fetch rooms",
        error:
          error.message,
      });
    }
  }
);

// =====================================
// CREATE BOOKING + FILE UPLOAD
// =====================================

app.post(
  "/api/bookings",
  upload.single("document"),
  async (req, res) => {
    try {
      console.log(
        "BOOKING BODY:",
        req.body
      );

      console.log(
        "UPLOADED FILE:",
        req.file
      );

      const {
        studentId,
        roomNumber,
        hostelName,
        floor,
        fullName,
        enrollment,
        branch,
        year,
      } = req.body || {};

      // Required fields check
      if (
        !studentId ||
        !roomNumber ||
        !hostelName ||
        !floor ||
        !fullName ||
        !enrollment ||
        !branch ||
        !year
      ) {
        return res.status(400).json({
          message:
            "Please fill all required details",
        });
      }

      // =================================
      // STUDENT CHECK
      // =================================

      const student =
        await Student.findById(
          studentId
        );

      if (!student) {
        return res.status(404).json({
          message:
            "Student not found",
        });
      }

      // Student already has active booking
      if (
        student.bookingStatus ===
          "Pending" ||
        student.bookingStatus ===
          "Confirmed"
      ) {
        return res.status(400).json({
          message:
            "Student already has an active booking",
        });
      }

      // =================================
      // FIND ROOM
      // =================================

      const room =
        await Room.findOne({
          roomNumber:
            roomNumber.toString(),

          hostelName:
            hostelName,

          floor:
            Number(floor),
        });

      if (!room) {
        return res.status(404).json({
          message:
            "Room not found",
        });
      }

      // =================================
      // SINGLE OCCUPANCY
      // =================================

      const activeBooking =
        await Booking.findOne({
          hostelName:
            hostelName,

          floor:
            Number(floor),

          roomNumber:
            roomNumber.toString(),

          status: {
            $in: [
              "Pending",
              "Confirmed",
            ],
          },
        });

      if (activeBooking) {
        return res.status(400).json({
          message:
            "This room is already booked or awaiting approval",
        });
      }

      // =================================
      // ROOM CAPACITY
      // =================================

      if (room.occupied >= 1) {
        room.capacity = 1;
        room.occupied = 1;
        room.status = "Full";

        await room.save();

        return res.status(400).json({
          message:
            "This room is already occupied",
        });
      }

      // =================================
      // DOCUMENT PATH
      // =================================

      const documentPath =
        req.file
          ? `/uploads/${req.file.filename}`
          : "";

      // =================================
      // CREATE BOOKING
      // =================================

      const booking =
        new Booking({
          studentId:
            student._id,

          studentName:
            fullName,

          enrollment:
            enrollment,

          branch:
            branch,

          year:
            year,

          hostelName:
            hostelName,

          floor:
            Number(floor),

          roomNumber:
            roomNumber.toString(),

          document:
            documentPath,

          status:
            "Pending",
        });

      await booking.save();

      // =================================
      // UPDATE STUDENT
      // =================================

      student.hostel =
        hostelName;

      student.roomNumber =
        roomNumber.toString();

      student.bookingStatus =
        "Pending";

      await student.save();

      // =================================
      // UPDATE ROOM
      // SINGLE OCCUPANCY
      // =================================

      room.capacity = 1;
      room.occupied = 1;
      room.status = "Full";

      await room.save();

      res.status(201).json({
        message:
          "Booking request submitted successfully ✅",

        booking:
          booking,
      });

    } catch (error) {
      console.error(
        "Booking Error:",
        error
      );

      res.status(500).json({
        message:
          "Booking failed ❌",

        error:
          error.message,
      });
    }
  }
);

// =====================================
// GET ALL BOOKINGS
// =====================================

app.get(
  "/api/bookings",
  async (req, res) => {
    try {
      const bookings =
        await Booking.find()
          .populate(
            "studentId",
            "name email rollNumber phone course year"
          )
          .sort({
            createdAt: -1,
          });

      res.status(200).json(
        bookings
      );
    } catch (error) {
      console.error(
        "Booking Fetch Error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to fetch bookings",
        error:
          error.message,
      });
    }
  }
);

// =====================================
// APPROVE BOOKING
// =====================================

app.put(
  "/api/bookings/:id/approve",
  async (req, res) => {
    try {
      const booking =
        await Booking.findById(
          req.params.id
        );

      if (!booking) {
        return res.status(404).json({
          message:
            "Booking not found",
        });
      }

      // Already processed
      if (
        booking.status !==
        "Pending"
      ) {
        return res.status(400).json({
          message:
            "This booking has already been processed",
        });
      }

      // =================================
      // CHECK ROOM
      // =================================

      const room =
        await Room.findOne({
          roomNumber:
            booking.roomNumber,

          hostelName:
            booking.hostelName,

          floor:
            booking.floor,
        });

      if (!room) {
        return res.status(404).json({
          message:
            "Room not found",
        });
      }

      // Check for another active booking
      const otherBooking =
        await Booking.findOne({
          _id: {
            $ne:
              booking._id,
          },

          hostelName:
            booking.hostelName,

          floor:
            booking.floor,

          roomNumber:
            booking.roomNumber,

          status: "Confirmed",
        });

      if (otherBooking) {
        return res.status(400).json({
          message:
            "This room is already occupied by another student",
        });
      }

      // =================================
      // CONFIRM BOOKING
      // =================================

      booking.status =
        "Confirmed";

      await booking.save();

      // =================================
      // UPDATE STUDENT
      // =================================

      const student =
        await Student.findById(
          booking.studentId
        );

      if (student) {
        student.bookingStatus =
          "Confirmed";

        student.hostel =
          booking.hostelName;

        student.roomNumber =
          booking.roomNumber;

        await student.save();
      }

      // =================================
      // UPDATE ROOM
      // =================================

      room.capacity = 1;
      room.occupied = 1;
      room.status = "Full";

      await room.save();

      res.json({
        message:
          "Booking approved successfully ✅",

        booking:
          booking,
      });

    } catch (error) {
      console.error(
        "Approve Error:",
        error
      );

      res.status(500).json({
        message:
          "Approval failed",

        error:
          error.message,
      });
    }
  }
);

// =====================================
// REJECT BOOKING
// =====================================

app.put(
  "/api/bookings/:id/reject",
  async (req, res) => {
    try {
      const booking =
        await Booking.findById(
          req.params.id
        );

      if (!booking) {
        return res.status(404).json({
          message:
            "Booking not found",
        });
      }

      // Already processed
      if (
        booking.status !==
        "Pending"
      ) {
        return res.status(400).json({
          message:
            "This booking has already been processed",
        });
      }

      booking.status =
        "Rejected";

      await booking.save();

      // =================================
      // UPDATE STUDENT
      // =================================

      const student =
        await Student.findById(
          booking.studentId
        );

      if (student) {
        student.bookingStatus =
          "Rejected";

        student.hostel = "";

        student.roomNumber = "";

        await student.save();
      }

      // =================================
      // UPDATE ROOM
      // =================================

      const room =
        await Room.findOne({
          roomNumber:
            booking.roomNumber,

          hostelName:
            booking.hostelName,

          floor:
            booking.floor,
        });

      if (room) {
        const otherActiveBooking =
          await Booking.findOne({
            _id: {
              $ne:
                booking._id,
            },

            hostelName:
              booking.hostelName,

            floor:
              booking.floor,

            roomNumber:
              booking.roomNumber,

            status: {
              $in: [
                "Pending",
                "Confirmed",
              ],
            },
          });

        if (!otherActiveBooking) {
          room.capacity = 1;
          room.occupied = 0;
          room.status =
            "Available";

          await room.save();
        }
      }

      res.json({
        message:
          "Booking rejected successfully ❌",

        booking:
          booking,
      });

    } catch (error) {
      console.error(
        "Reject Error:",
        error
      );

      res.status(500).json({
        message:
          "Rejection failed",

        error:
          error.message,
      });
    }
  }
);

// =====================================
// START SERVER
// =====================================

const PORT =
  process.env.PORT || 5000;

mongoose
  .connect(
    process.env.MONGODB_URI
  )
  .then(async () => {
    console.log(
      "MongoDB Connected Successfully ✅"
    );

    // =================================
    // FORCE ALL EXISTING ROOMS
    // TO SINGLE OCCUPANCY
    // =================================

    try {
      await Room.updateMany(
        {},
        {
          $set: {
            capacity: 1,
          },
        }
      );

      console.log(
        "All rooms set to single occupancy ✅"
      );
    } catch (error) {
      console.error(
        "Room capacity sync failed:",
        error.message
      );
    }

    app.listen(
      PORT,
      () => {
        console.log(
          `Server running on http://localhost:${PORT}`
        );
      }
    );
  })
  .catch((error) => {
    console.error(
      "MongoDB Connection Failed ❌"
    );

    console.error(
      error.message
    );
  });