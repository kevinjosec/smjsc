import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./students.css";
import Usernavbar from "../user-navbar/userNavbar";
import studentServices from "../../services/studentServices";
import { MdDeleteOutline, MdAdd } from "react-icons/md";
import getUserRole from "../../services/userServices";

const Students = () => {
  const [role, setRole] = useState();
  // State variables
  const [students, setStudents] = useState([]);
  const [error, setError] = useState(null);
  const [totalStudentsInUnit, setTotalStudentsInUnit] = useState(0);
  const [edit, setEdit] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [showAddStudentForm, setShowAddStudentForm] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: "",
    gender: "",
    class: "",
    unit: "",
    number: "",
    email: "",
    fees: false,
    dateOfBirth: "",
    dateOfBaptism: "",
    baptismName: "",
    category: "", // Reset to empty after adding
    fathersName: "",
    mothersName: "",
    homeParish: "",
    addressIndia: "",
    addressKuwait: "",
  });
  const [searchQuery, setSearchQuery] = useState(""); // Existing state for search query
  const [categoryFilter, setCategoryFilter] = useState(""); // New state for category filter

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const unitFilter = queryParams.get("unit") || "Salwa"; // Default to 'Salwa' if no query param

  // Fixed list of categories
  const categories = [
    "Kids Group",
    "Beginners",
    "Sub Juniors",
    "Juniors",
    "Intermediate",
    "Seniors",
  ];

  // Function to calculate category based on date of birth
  const calculateCategory = (dateOfBirth) => {
    if (!dateOfBirth) return "";
    const dob = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();

    // Adjust age if current month and day are before the birth month and day
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }

    if (age >= 3 && age <= 4) return "Kids Group";
    if (age >= 5 && age <= 7) return "Beginners";
    if (age >= 8 && age <= 10) return "Sub Juniors";
    if (age >= 11 && age <= 12) return "Juniors";
    if (age >= 13 && age <= 14) return "Intermediate";
    if (age >= 15 && age <= 17) return "Seniors";

    return ""; // Default case if the age is not in any category
  };

  // Fetch students and assign category
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const RES = await getUserRole();
        console.log("RES : ", RES);
        setRole(RES);
        const allStudents = await studentServices.getAllStudents();
        const unitFilterLower = unitFilter.toLowerCase();
        const filteredByUnit = allStudents.filter(
          (student) => student.unit.toLowerCase() === unitFilterLower
        );

        // Assign category to each student
        const studentsWithCategory = filteredByUnit.map((student) => ({
          ...student,
          category: calculateCategory(student.dateOfBirth),
        }));

        setStudents(studentsWithCategory);
        setTotalStudentsInUnit(studentsWithCategory.length);

        // Debugging: Log students with categories
        console.log("Fetched Students with Categories:", studentsWithCategory);
      } catch (e) {
        setError(e.message);
        console.error("Error fetching students:", e);
      }
    };
    fetchStudents();
  }, [unitFilter]);

  // Handle search input change
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle category filter change
  const handleCategoryFilterChange = (e) => {
    setCategoryFilter(e.target.value);
  };

  // Function to calculate age based on date of birth
  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return "";
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    // Adjust age if current month and day are before the birth month and day
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  // Filter students based on search query and category filter
  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter
      ? student.category === categoryFilter
      : true;
    return matchesSearch && matchesCategory;
  });

  // Group students by class
  const groupByClass = filteredStudents.reduce((acc, student) => {
    const classNum = student.class;
    if (!acc[classNum]) {
      acc[classNum] = [];
    }
    acc[classNum].push(student);
    return acc;
  }, {});

  // Sort classes numerically
  const sortedClasses = Object.keys(groupByClass).sort((a, b) => a - b);

  if (error) {
    return <div className="students-error">{error}</div>;
  }

  // Handle edit button click
  const handleEditClick = (student) => {
    setSelectedStudent(student);
    setEdit(true);
  };

  // Handle changes in the edit form
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setSelectedStudent({ ...selectedStudent, [name]: value });
  };

  // Handle saving changes in the edit form
  const handleSaveChanges = async (e) => {
    e.preventDefault();
    if (!selectedStudent || !selectedStudent.class) {
      console.error("Selected student is missing properties");
      return;
    }
    try {
      const updatedStudent = await studentServices.updateStudent(
        selectedStudent._id,
        selectedStudent
      );
      setStudents(
        students.map((student) =>
          student._id === selectedStudent._id ? updatedStudent : student
        )
      );

      setEdit(false);
      setSelectedStudent(null); // Reset selected student after saving

      // Debugging: Log updated student
      console.log("Updated Student:", updatedStudent);
    } catch (e) {
      setError(e.message);
      console.error("Error updating student:", e);
    }
  };

  // Handle canceling the edit
  const handleCancel = () => {
    setEdit(false);
    setSelectedStudent(null);
  };

  // Handle delete button click
  const handleDeleteClick = (student) => {
    setStudentToDelete(student);
    setShowDeleteModal(true);
  };

  // Handle confirming deletion
  const handleConfirmDelete = async () => {
    if (!studentToDelete) return;
    try {
      await studentServices.deleteStudent(studentToDelete._id);
      setStudents((prevStudents) =>
        prevStudents.filter((student) => student._id !== studentToDelete._id)
      );
      setShowDeleteModal(false);
      setEdit(false);
      setStudentToDelete(null);

      // Debugging: Log deletion
      console.log("Deleted Student:", studentToDelete);
    } catch (e) {
      setError(e.message);
      console.error("Error deleting student:", e);
    }
  };

  // Handle canceling deletion
  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setStudentToDelete(null);
  };

  // Handle add student button click
  const handleAddStudentClick = () => {
    setShowAddStudentForm(true);
    setNewStudent({
      ...newStudent,
      unit: unitFilter,
      category: "", // Initialize category
    });
  };

  // Function to calculate category during add student
  const handleAddStudentChange = (e) => {
    const { name, value } = e.target;

    if (name === "dateOfBirth") {
      // Calculate the category when the date of birth changes
      const category = calculateCategory(value);
      setNewStudent((prev) => ({
        ...prev,
        [name]: value,
        category: category, // Set the calculated category
      }));
    } else {
      setNewStudent((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handle submitting the add student form
  const handleAddStudentSubmit = async (e) => {
    e.preventDefault();
    try {
      const addedStudent = await studentServices.createStudent(newStudent);

      // Calculate category based on the date of birth
      const category = calculateCategory(addedStudent.dateOfBirth);

      // Update the state with the correct category
      setStudents((prevStudents) => [
        ...prevStudents,
        { ...addedStudent, category }, // Use the calculated category
      ]);

      setShowAddStudentForm(false);
      setNewStudent({
        name: "",
        gender: "",
        class: "",
        unit: unitFilter,
        number: "",
        email: "",
        fees: false,
        dateOfBirth: "",
        dateOfBaptism: "",
        baptismName: "",
        category: category, // Reset to empty after adding
        fathersName: "",
        mothersName: "",
        homeParish: "",
        addressIndia: "",
        addressKuwait: "",
      });

      console.log("Added Student:", { ...addedStudent, category });
    } catch (e) {
      setError(e.message);
      console.error("Error adding student:", e);
    }
  };

  // Handle canceling add student
  const handleCancelAddStudent = () => {
    setShowAddStudentForm(false);
  };

  return (
    <div className="students-container">
      <Usernavbar />

      <div className="header">
        <h2 className="unit-name">
          {unitFilter} Sunday School{" "}
          <div className="unit-count">({totalStudentsInUnit} students)</div>{" "}
        </h2>
        <div/>
        <div/>
        <div className="filter">
          {/* Search Input */}
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={handleSearch}
          className="search-input"
        />
        {/* Category Filter */}
        <select
          value={categoryFilter}
          onChange={handleCategoryFilterChange}
          className="category-filter"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        {role === "headmaster" && (
          <button
            className="add-student-button"
            onClick={() => handleAddStudentClick()}
          >
           <MdAdd style={{ fontSize: "1.5em" }} />  <p>Add Student</p> 
          </button>
        )}
        </div>
      </div>

      <div className="controls"></div>
      {sortedClasses.length > 0 ? (
        sortedClasses.map((classNum) => {
          const sortedStudents = groupByClass[classNum].sort((a, b) => {
            if (a.fees === b.fees) {
              return a.name.localeCompare(b.name);
            }
            return a.fees ? 1 : -1;
          });

          return (
            <div className="class-container" key={classNum}>
              <div className="class-heading-container">
                <h3 className="class-heading">
                  Class {classNum} ({sortedStudents.length})
                </h3>
              </div>
              <div className="student-details title-bar">
                <div>Name</div>
                <div>Gender</div>
                <div>Contact no</div>
                <div>Email</div>
                <div>Fees status</div>
              </div>
              {sortedStudents.map((student) => (
                <div className="student-details content" key={student._id}>
                  <div className="name">{student.name}</div>
                  <div className="gender">{student.gender}</div>
                  <div className="number">{student.number}</div>
                  <div className="email">{student.email}</div>
                  <div className={`fees ${student.fees ? "paid" : "not-paid"}`}>
                    {student.fees ? "Paid" : "Pending"}
                  </div>
                  {role === "headmaster" && (
                    <div
                      className="edit"
                      onClick={() => handleEditClick(student)}
                    >
                      Edit
                    </div>
                  )}
                  <div className="class">Class {student.class}</div>
                </div>
              ))}
            </div>
          );
        })
      ) : (
        <div className="no-students">
          No students found in the selected category
        </div>
      )}

      {/* Edit Modal */}
      {edit && selectedStudent && (
        <div className="edit-container">
          <div className="modal-content">
            <h2 className="modal-header">
              Edit Student
              <MdDeleteOutline
                className="delete-icon"
                onClick={() => handleDeleteClick(selectedStudent)}
              />
            </h2>
            <form onSubmit={handleSaveChanges}>
              <label>
                Name
                <input
                  type="text"
                  name="name"
                  value={selectedStudent.name}
                  onChange={handleEditChange}
                  required
                />
              </label>
              <label>
                Contact number
                <input
                  type="text"
                  name="number"
                  value={selectedStudent.number}
                  onChange={handleEditChange}
                  required
                />
              </label>
              <label>
                Email
                <input
                  type="email"
                  name="email"
                  value={selectedStudent.email}
                  onChange={handleEditChange}
                  required
                />
              </label>
              <label>
                Fees status
                <select
                  name="fees"
                  value={selectedStudent.fees}
                  onChange={handleEditChange}
                  required
                >
                  <option value={true}>Paid</option>
                  <option value={false}>Pending</option>
                </select>
              </label>
              {/* Date of Birth Field */}
              <label>
                Date of Birth
                <input
                  type="date"
                  name="dateOfBirth"
                  value={
                    selectedStudent.dateOfBirth
                      ? selectedStudent.dateOfBirth.split("T")[0]
                      : ""
                  }
                  onChange={(e) => {
                    handleEditChange(e);
                    // Update category based on DOB
                    const updatedDOB = e.target.value;
                    const updatedCategory = calculateCategory(updatedDOB);
                    setSelectedStudent((prev) => ({
                      ...prev,
                      dateOfBirth: updatedDOB,
                      category: updatedCategory,
                    }));
                  }}
                />
              </label>
              {/* Age Field - calculated based on Date of Birth */}
              <label>
                Age
                <input
                  type="number"
                  name="age"
                  value={calculateAge(selectedStudent.dateOfBirth)} // Calculate age based on DOB
                  readOnly
                />
              </label>
              {/* Date of Baptism Field */}
              <label>
                Date of Baptism
                <input
                  type="date"
                  name="dateOfBaptism"
                  value={
                    selectedStudent.dateOfBaptism
                      ? selectedStudent.dateOfBaptism.split("T")[0]
                      : ""
                  }
                  onChange={handleEditChange}
                />
              </label>
              <label>
                Baptism Name
                <input
                  type="text"
                  name="baptismName"
                  value={selectedStudent.baptismName}
                  onChange={handleEditChange}
                />
              </label>
              <label>
                Category
                <input
                  type="text"
                  name="category"
                  value={calculateCategory(selectedStudent.dateOfBirth)} // Calculate category based on DOB
                  readOnly
                />
              </label>
              <label>
                Father's Name
                <input
                  type="text"
                  name="fathersName"
                  value={selectedStudent.fathersName}
                  onChange={handleEditChange}
                />
              </label>
              <label>
                Mother's Name
                <input
                  type="text"
                  name="mothersName"
                  value={selectedStudent.mothersName}
                  onChange={handleEditChange}
                />
              </label>
              <label>
                Home Parish
                <input
                  type="text"
                  name="homeParish"
                  value={selectedStudent.homeParish}
                  onChange={handleEditChange}
                />
              </label>
              <label>
                Address in India
                <input
                  type="text"
                  name="addressIndia"
                  value={selectedStudent.addressIndia}
                  onChange={handleEditChange}
                />
              </label>
              <label>
                Address in Kuwait
                <input
                  type="text"
                  name="addressKuwait"
                  value={selectedStudent.addressKuwait}
                  onChange={handleEditChange}
                />
              </label>
              <div className="form-buttons">
                <button type="button" onClick={handleCancel}>
                  Cancel
                </button>
                <button type="submit">Save changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="delete-modal">
          <div className="modal-content">
            <h2>Confirm Deletion</h2>
            <p>Are you sure you want to delete {studentToDelete?.name}?</p>
            <div className="modal-buttons">
              <button onClick={handleCancelDelete}>Cancel</button>
              <button onClick={handleConfirmDelete}>Yes, delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Student Form */}
      {showAddStudentForm && (
        <div className="add-student-form">
          <div className="modal-content">
            <h2>Add New Student</h2>
            <form onSubmit={handleAddStudentSubmit}>
              <label>
                Name
                <input
                  type="text"
                  name="name"
                  value={newStudent.name}
                  onChange={handleAddStudentChange}
                  required
                  pattern="^[A-Za-z\s]+$" // Allows only alphabets and spaces
                  title="Name should contain only letters"
                />
              </label>
              <label>
                Gender
                <select
                  name="gender"
                  value={newStudent.gender}
                  onChange={handleAddStudentChange}
                  required
                >
                  <option value="" disabled>
                    Select
                  </option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                  <option value="Other">Other</option>
                </select>
              </label>
              <label>
                Class
                <input
                  type="number"
                  name="class"
                  value={newStudent.class}
                  onChange={handleAddStudentChange}
                  required
                  min="1"
                  max="12" // Restrict class value to be less than or equal to 12
                  title="Class should be a number between 1 and 12"
                />
              </label>
              <label>
                Unit
                <input
                  type="text"
                  name="unit"
                  value={newStudent.unit}
                  readOnly
                  required
                />
              </label>
              <label>
                Number
                <input
                  type="number"
                  name="number"
                  value={newStudent.number}
                  onChange={handleAddStudentChange}
                  required
                  pattern="\d{8}" // Restrict to exactly 8 digits
                  title="Number must be exactly 8 digits"
                />
              </label>
              <label>
                Email
                <input
                  type="email"
                  name="email"
                  value={newStudent.email}
                  onChange={handleAddStudentChange}
                  required
                />
              </label>
              <label>
                Fees status
                <select
                  name="fees"
                  value={newStudent.fees}
                  onChange={handleAddStudentChange}
                  required
                >
                  <option value={true}>Paid</option>
                  <option value={false}>Pending</option>
                </select>
              </label>
              {/* New fields */}
              <label>
                Date of Birth
                <input
                  type="date"
                  name="dateOfBirth"
                  value={
                    newStudent.dateOfBirth
                      ? newStudent.dateOfBirth.split("T")[0]
                      : ""
                  }
                  onChange={handleAddStudentChange}
                  required
                />
              </label>
              <label>
                Date of Baptism
                <input
                  type="date"
                  name="dateOfBaptism"
                  value={
                    newStudent.dateOfBaptism
                      ? newStudent.dateOfBaptism.split("T")[0]
                      : ""
                  }
                  onChange={handleAddStudentChange}
                  required
                />
              </label>
              <label>
                Baptism Name
                <input
                  type="text"
                  name="baptismName"
                  value={newStudent.baptismName}
                  onChange={handleAddStudentChange}
                  required
                  pattern="^[A-Za-z\s]+$" // Allows only alphabets and spaces
                  title="Baptism name should contain only letters"
                />
              </label>
              <label>
                Father's Name
                <input
                  type="text"
                  name="fathersName"
                  value={newStudent.fathersName}
                  onChange={handleAddStudentChange}
                  required
                  pattern="^[A-Za-z\s]+$" // Allows only alphabets and spaces
                  title="Father's name should contain only letters"
                />
              </label>
              <label>
                Mother's Name
                <input
                  type="text"
                  name="mothersName"
                  value={newStudent.mothersName}
                  onChange={handleAddStudentChange}
                  required
                  pattern="^[A-Za-z\s]+$" // Allows only alphabets and spaces
                  title="Mother's name should contain only letters"
                />
              </label>
              <label>
                Home Parish
                <input
                  type="text"
                  name="homeParish"
                  value={newStudent.homeParish}
                  onChange={handleAddStudentChange}
                  required
                />
              </label>
              <label>
                Address in India
                <input
                  type="text"
                  name="addressIndia"
                  value={newStudent.addressIndia}
                  onChange={handleAddStudentChange}
                  required
                />
              </label>
              <label>
                Address in Kuwait
                <input
                  type="text"
                  name="addressKuwait"
                  value={newStudent.addressKuwait}
                  onChange={handleAddStudentChange}
                  required
                />
              </label>
              <div className="form-buttons">
                <button type="button" onClick={handleCancelAddStudent}>
                  Cancel
                </button>
                <button type="submit">Add Student</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;
