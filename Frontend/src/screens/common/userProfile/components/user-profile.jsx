import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Lock } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import apiClient from "@/api/apiClient";
import moment from "moment";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

const UserInformationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editableUser, setEditableUser] = useState({
    fullName: "",
    email: "",
    gender: "",
    address: "",
    dob: "",
    phone: "",
    avatar: ""
  });
  const [isFormValid, setIsFormValid] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await apiClient.get(`/auth/user-profile/${id}`);
        setUser(response.data || null);
        setEditableUser({
          fullName: response.data.fullName,
          email: response.data.email,
          gender: response.data.gender,
          address: response.data.address,
          dob: response.data.dob,
          phone: response.data.phone,
          avatar: response.data.avatar
        });
      } catch (err) {
        setError("Failed to fetch user data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, [id]);

  useEffect(() => {
    validateForm();
  }, [editableUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setEditableUser((prev) => ({ ...prev, avatar: URL.createObjectURL(file) }));
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isFullNameValid = editableUser.fullName.trim() !== "";
    const isEmailValid = emailRegex.test(editableUser.email);
    const isDobValid = editableUser.dob && new Date(editableUser.dob) <= new Date();
    setIsFormValid(isFullNameValid && isEmailValid && isDobValid);
  };

  const handleSave = async () => {
    if (!isFormValid) {
      setError("Please correct the errors in the form.");
      return;
    }

    try {
      const response = await apiClient.put(`/auth/user-profile/${id}`, editableUser);
      if (response.status === 200) {
        setUser(editableUser);
        setEditMode(false);
        setError(null); // Clear error if update is successful
      } else {
        throw new Error("Unexpected response from server.");
      }
    } catch (err) {
      console.error("Update failed:", err);
      setError("Failed to update user data. Please try again later.");
    }
  };

  const handleChangePassword = () => {
    setShowModal(true);
  };

  const handleConfirmChangePassword = () => {
    setShowModal(false);
    navigate("/changePassword");
  };

  const handleCancelChangePassword = () => {
    setShowModal(false);
  };

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (!user) return <p className="text-gray-500 text-center">No user data available.</p>;

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <Card className="w-full border-0 shadow-none bg-transparent">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800">User Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <img
              src={editableUser.avatar || "/api/placeholder/80/80"}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover border cursor-pointer"
              onClick={() => fileInputRef.current.click()}
            />
            {editMode && (
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                ref={fileInputRef}
                className="hidden"
              />
            )}
            <div>
              <p className="text-gray-500 text-sm">{editableUser.email || "N/A"}</p>
              <p className="text-lg font-medium text-gray-800">{editableUser.fullName || "Unknown User"}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-700">Full Name</label>
              <Input
                className="bg-gray-50"
                name="fullName"
                value={editableUser.fullName}
                onChange={handleInputChange}
                readOnly={!editMode}
              />
              {!editableUser.fullName.trim() && <p className="text-red-500 text-sm">Full name is required.</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <Input
                className="bg-gray-50"
                name="email"
                value={editableUser.email}
                onChange={handleInputChange}
                readOnly={!editMode}
              />
              {!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editableUser.email) && <p className="text-red-500 text-sm">Invalid email address.</p>}
            </div>
          </div>

          <div className="grid grid-cols-12 gap-6 mt-4">
            <div className="col-span-3">
              <label className="text-sm font-medium text-gray-700">Gender</label>
              {editMode ? (
                <Select
                  name="gender"
                  value={editableUser.gender}
                  onValueChange={(value) => setEditableUser((prev) => ({ ...prev, gender: value }))}
                >
                  <SelectTrigger className="bg-gray-50">
                    <SelectValue placeholder={editableUser.gender || "Select"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Input className="bg-gray-50" value={editableUser.gender || ""} readOnly />
              )}
            </div>
            <div className="col-span-3">
              <label className="text-sm font-medium text-gray-700">Address</label>
              <Input
                className="bg-gray-50"
                name="address"
                value={editableUser.address}
                onChange={handleInputChange}
                readOnly={!editMode}
              />
            </div>
            <div className="col-span-3">
              <label className="text-sm font-medium text-gray-700">Date of birth</label>
              {editMode ? (
                <DatePicker
                  selected={editableUser.dob ? new Date(editableUser.dob) : null}
                  onChange={(date) => setEditableUser((prev) => ({ ...prev, dob: date }))}
                  dateFormat="dd/MM/yyyy"
                  className="bg-gray-50 w-full p-2 border rounded"
                  maxDate={new Date()}
                />
              ) : (
                <Input
                  className="bg-gray-50"
                  name="dob"
                  value={editableUser.dob ? moment(editableUser.dob).format("DD/MM/YYYY") : ""}
                  readOnly
                />
              )}
              {editableUser.dob && new Date(editableUser.dob) > new Date() && <p className="text-red-500 text-sm">Date of birth cannot be in the future.</p>}
            </div>
            <div className="col-span-3">
              <label className="text-sm font-medium text-gray-700">Phone Number</label>
              <Input
                className="bg-gray-50"
                name="phone"
                value={editableUser.phone}
                onChange={handleInputChange}
                readOnly={!editMode}
              />
            </div>
          </div>

          <div className="mt-6 flex justify-between items-center">
            <Button className="bg-blue-500 hover:bg-blue-600" onClick={() => navigate("/")}>
              Back
            </Button>
            <div className="flex space-x-4">
              {editMode ? (
                <Button className="bg-green-500 hover:bg-green-600" onClick={handleSave} disabled={!isFormValid}>
                  Save
                </Button>
              ) : (
                <Button className="bg-blue-500 hover:bg-blue-600" onClick={() => setEditMode(true)}>
                  Edit
                </Button>
              )}
              <Button className="bg-red-500 text-white">Log out</Button>
            </div>
          </div>

          <div className="mt-6">
            <Button className="w-full bg-blue-500 hover:bg-blue-600 flex items-center" onClick={handleChangePassword}>
              <Lock className="mr-2" /> Change Password
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>Are you sure you want to change your password?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelChangePassword}>
              No
            </Button>
            <Button variant="primary" onClick={handleConfirmChangePassword}>
              Yes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserInformationPage;