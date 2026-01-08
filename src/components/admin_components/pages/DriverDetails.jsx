import { useMemo, useState } from "react";
import styles from "../css/DriverDetails.module.css";
import Modal from "../widgets/Modal";
import { FiEdit2, FiTrash2, FiPlus, FiLock } from "react-icons/fi";
import { authAPI } from "@/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

/* ---------------- MOCK DATA ---------------- */

const initialDrivers = [
  {
    id: 1,
    username: "driver_wlg_01",
    name: "John Smith",
    email: "john.smith@linehaul.co.nz",
    phone: "0212345678",
    license: "NZDL-456789",
    status: "Active",
    documents: {}
  },

  {
    id: 2,
    username: "motu_taupo",
    name: "Motu",
    email: "motu@linehaul.co.nz",
    phone: "0214567890",
    license: "NZDL-102345",
    status: "Active",
    documents: {}
  },
  {
    id: 3,
    username: "frank_taupo",
    name: "Frank",
    email: "frank@linehaul.co.nz",
    phone: "0215678901",
    license: "NZDL-203456",
    status: "Active",
    documents: {}
  },
  {
    id: 4,
    username: "aman_taupo",
    name: "Aman",
    email: "aman@linehaul.co.nz",
    phone: "0216789012",
    license: "NZDL-304567",
    status: "Active",
    documents: {}
  },
  {
    id: 5,
    username: "ravi_taupo",
    name: "Ravi",
    email: "ravi@linehaul.co.nz",
    phone: "0217890123",
    license: "NZDL-405678",
    status: "Active",
    documents: {}
  },

  {
    id: 6,
    username: "cas_pn",
    name: "CAS",
    email: "cas@linehaul.co.nz",
    phone: "0218901234",
    license: "NZDL-506789",
    status: "Active",
    documents: {}
  },
  {
    id: 7,
    username: "simon_pn",
    name: "Simon",
    email: "simon@linehaul.co.nz",
    phone: "0219012345",
    license: "NZDL-607890",
    status: "Active",
    documents: {}
  },
  {
    id: 8,
    username: "luke_pn",
    name: "Luke",
    email: "luke@linehaul.co.nz",
    phone: "0210123456",
    license: "NZDL-708901",
    status: "Active",
    documents: {}
  },

  {
    id: 9,
    username: "arshpreet_wlg",
    name: "Arshpreet",
    email: "arshpreet@linehaul.co.nz",
    phone: "0211234567",
    license: "NZDL-809012",
    status: "Active",
    documents: {}
  },
  {
    id: 10,
    username: "kartic_wlg",
    name: "Kartic",
    email: "kartic@linehaul.co.nz",
    phone: "0212345679",
    license: "NZDL-910123",
    status: "Active",
    documents: {}
  },
  {
    id: 11,
    username: "jaspreet_wlg",
    name: "Jaspreet",
    email: "jaspreet@linehaul.co.nz",
    phone: "0213456789",
    license: "NZDL-112233",
    status: "Active",
    documents: {}
  },
  {
    id: 12,
    username: "nikhil_wlg",
    name: "Nikhil",
    email: "nikhil@linehaul.co.nz",
    phone: "0214567891",
    license: "NZDL-223344",
    status: "Active",
    documents: {}
  },
  {
    id: 13,
    username: "ben_wlg",
    name: "Ben",
    email: "ben@linehaul.co.nz",
    phone: "0215678912",
    license: "NZDL-334455",
    status: "Active",
    documents: {}
  },

  {
    id: 14,
    username: "keith_ctz",
    name: "Keith",
    email: "keith@linehaul.co.nz",
    phone: "0216789123",
    license: "NZDL-445566",
    status: "Active",
    documents: {}
  },
  {
    id: 15,
    username: "travis_ctz",
    name: "Travis",
    email: "travis@linehaul.co.nz",
    phone: "0217891234",
    license: "NZDL-556677",
    status: "Active",
    documents: {}
  },
  {
    id: 16,
    username: "jordan_ctz",
    name: "Jordan",
    email: "jordan@linehaul.co.nz",
    phone: "0218912345",
    license: "NZDL-667788",
    status: "Active",
    documents: {}
  },
  {
    id: 17,
    username: "paul_ctz",
    name: "Paul",
    email: "paul@linehaul.co.nz",
    phone: "0219123456",
    license: "NZDL-778899",
    status: "Active",
    documents: {}
  },
  {
    id: 18,
    username: "aaron_ctz",
    name: "Aaron",
    email: "aaron@linehaul.co.nz",
    phone: "0210234567",
    license: "NZDL-889900",
    status: "Active",
    documents: {}
  },
  {
    id: 19,
    username: "sam_ctz",
    name: "Sam",
    email: "sam@linehaul.co.nz",
    phone: "0211345678",
    license: "NZDL-990011",
    status: "Active",
    documents: {}
  }
];


const emptyDriver = {
    name: "",
    email: "",
    phone: "",
    license_number: "",
    status: "Active",
    documents: {}
};

const DriverDetails = () => {
    /* ---------------- STATE ---------------- */
    // const [drivers, setDrivers] = useState(initialDrivers);

    const queryClient = useQueryClient();

    const { data: drivers } = useQuery({
        queryKey: ["linehaulPlan-drivers"],
        queryFn: authAPI.getDrivers,
        initialData: []
    });

    const updateDriverMutation = useMutation({
        mutationFn: ({driverId, updatedDriver}) => authAPI.updateDriver(driverId, updatedDriver),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["linehaulPlan-drivers"] });
        }
    });

    const registerDriverMutation = useMutation({
        mutationFn: (newDriver) => authAPI.registerDriver(newDriver),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["linehaulPlan-drivers"] });
        }
    });

    const deleteDriverMutation = useMutation({
        mutationFn: (driverId) => authAPI.deleteDriver(driverId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["linehaulPlan-drivers"] });
        }
    });

    const updateDriverPasswordMutation = useMutation({
        mutationFn: ({driverId, newPassword}) => authAPI.updateDriverPassword(driverId, {newPassword: newPassword}),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["linehaulPlan-drivers"] });
        }
    });


    /* filters */
    const [filterName, setFilterName] = useState("");
    const [filterPhone, setFilterPhone] = useState("");
    const [filterEmail, setFilterEmail] = useState("");

    /* modals */
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    /* forms */
    const [loginForm, setLoginForm] = useState({
        username: "",
        password: "",
        confirm: "",
        name: "",
        email: "",
        phone: "",
        license_number: "",
        status: "Active",
    });

    const [driverForm, setDriverForm] = useState(emptyDriver);
    const [editingDriver, setEditingDriver] = useState(null);

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    /* ---------------- FILTER ---------------- */

    const filteredDrivers = drivers?.data?.filter(d =>
        d.name.toLowerCase().includes(filterName.toLowerCase()) &&
        d?.phone?.toLowerCase().includes(filterPhone?.toLowerCase()) &&
        d?.email?.toLowerCase().includes(filterEmail.toLowerCase())
    );

    /* ---------------- VALIDATION ---------------- */

    const validatePassword = (password, confirm) => {
        const regex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

        if (!regex.test(password)) {
            alert(
                "Password must be 8+ chars with uppercase, lowercase, number & special character"
            );
            return false;
        }

        if (password !== confirm) {
            alert("Passwords do not match");
            return false;
        }

        return true;
    };

    /* ---------------- ACTIONS ---------------- */

    const openAddDriver = () => {
        setLoginForm({ username: "", password: "", confirm: "" });
        setDriverForm(emptyDriver);
        setEditingDriver(null);
        setShowLoginModal(true);
    };

    const submitLogin = () => {
        if (!loginForm.username) {
            alert("Username required");
            return;
        }

        if (!validatePassword(loginForm.password, loginForm.confirm)) return;

        setShowLoginModal(false);
        // save to drivers list
        registerDriverMutation.mutate({
            username: loginForm.username,
            password: loginForm.password,
            name: loginForm.name,
            email: loginForm.email,
            phone: loginForm.phone,
            license_number: loginForm.license_number,
            status: "Active",
        });

        setDriverForm({
            name: loginForm.name,
            email: loginForm.email,
            phone: loginForm.phone,
            license_number: loginForm.license_number,
            status: "Active",
            documents: {}
        }); 
    };
    const saveDriver = () => {
        if (!driverForm.name || !driverForm.phone) {
            alert("Name & phone required");
            return;
        }
        
        updateDriverMutation.mutate({
            driverId: editingDriver._id,
            updatedDriver: driverForm
        });

        setShowDetailsModal(false);
    };

    const editDriver = (driver) => {
        setEditingDriver(driver);
        setDriverForm(driver);
        setShowDetailsModal(true);
    };

    const deleteDriver = (id) => {
        if (window.confirm("Delete this driver?")) {
            deleteDriverMutation.mutate(id);
        }
    };

    const updatePassword = () => {
        if (!validatePassword(newPassword, confirmPassword)) return;
        updateDriverPasswordMutation.mutate({
            driverId: editingDriver._id,
            newPassword: newPassword
        });
        setShowPasswordModal(false);
        
    };

    /* ---------------- UI ---------------- */

    return (
        <div className={styles.driverWrapper}>
            <div className="card">
                <h3>Driver Details</h3>

                {/* TABLE */}
                <div className={styles.entryTable}>
                    <table>
                        <thead>
                            <tr>
                                <th>
                                    Name
                                    <input placeholder="Search" value={filterName} onChange={e => setFilterName(e.target.value)} />
                                </th>
                                <th>
                                    Phone
                                    <input placeholder="Search" value={filterPhone} onChange={e => setFilterPhone(e.target.value)} />
                                </th>
                                <th>
                                    Email
                                    <input placeholder="Search" value={filterEmail} onChange={e => setFilterEmail(e.target.value)} />
                                </th>
                                <th>License</th>
                                <th>Status</th>
                                <th className={styles.actionTd}>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredDrivers?.data?.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className={styles.noResults}>No results</td>
                                </tr>
                            ) : (
                                filteredDrivers?.map(d => (
                                   
                                    <tr key={d._id}>
                                        <td>{d.name}</td>
                                        <td>{d.phone}</td>
                                        <td>{d.email}</td>
                                        <td>{d.license_number}</td>
                                        <td>{d.is_active ? "Active" : "Inactive"}</td>
                                        <td className={styles.actionTd}>
                                            <button className={styles.iconBtn} onClick={() => editDriver(d)} title="Edit" ><FiEdit2 /></button>
                                            <button className={styles.iconBtn} onClick={() => {
                                                setEditingDriver(d);
                                                setShowPasswordModal(true);
                                            }} title="Change Password" ><FiLock /></button>
                                            <button className={styles.iconBtn} onClick={() => deleteDriver(d._id)} title="Delete" ><FiTrash2 /></button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    <button className={styles.primaryBtn} onClick={openAddDriver}>
                        <FiPlus /> Add Driver
                    </button>
                </div>
            </div>

            {/* LOGIN MODAL */}
            <Modal
                open={showLoginModal}
                title="Create Driver Login"
                onClose={() => setShowLoginModal(false)}
                actions={
                    <>
                        <button
                            className={styles.cancelBtn}
                            onClick={() => setShowLoginModal(false)}
                        >
                            Cancel
                        </button>
                        <button
                            className={`${styles.primaryBtn}  mt-0`}
                            onClick={submitLogin}
                        >
                            Next
                        </button>
                    </>
                }
            >
                <input
                    placeholder="Username"
                    value={loginForm.username}
                    onChange={e =>
                        setLoginForm({ ...loginForm, username: e.target.value })
                    }
                />

                <input
                    type="password"
                    placeholder="Password"
                    onChange={e =>
                        setLoginForm({ ...loginForm, password: e.target.value })
                    }
                />

                <input
                    type="password"
                    placeholder="Confirm Password"
                    onChange={e =>
                        setLoginForm({ ...loginForm, confirm: e.target.value })
                    }
                />

                <input
                    placeholder="Full Name"
                    value={loginForm.name}
                    onChange={e =>
                        setLoginForm({ ...loginForm, name: e.target.value })
                    }
                />

                <input
                    placeholder="Email"
                    value={loginForm.email}
                    onChange={e =>
                        setLoginForm({ ...loginForm, email: e.target.value })
                    }
                />

                <input
                    placeholder="Phone"
                    value={loginForm.phone}
                    onChange={e =>
                        setLoginForm({ ...loginForm, phone: e.target.value })
                    }
                />

                <input
                    placeholder="License Number"
                    value={loginForm.license_number}
                    onChange={e =>
                        setLoginForm({ ...loginForm, license_number: e.target.value })
                    }
                />


            </Modal>

            {/* DETAILS MODAL */}
            <Modal
                open={showDetailsModal}
                title="Driver Details"
                onClose={() => setShowDetailsModal(false)}
                actions={
                    <>
                        <button
                            className={styles.cancelBtn}
                            onClick={() => setShowDetailsModal(false)}
                        >
                            Cancel
                        </button>
                        <button
                            className={`${styles.primaryBtn}  mt-0`}
                            onClick={saveDriver}
                        >
                            Save
                        </button>
                    </>
                }
            >
                <input
                    placeholder="Full Name"
                    value={driverForm.name}
                    onChange={e =>
                        setDriverForm({ ...driverForm, name: e.target.value })
                    }
                />

                <input
                    placeholder="Email"
                    value={driverForm.email}
                    onChange={e =>
                        setDriverForm({ ...driverForm, email: e.target.value })
                    }
                />

                <input
                    placeholder="Phone"
                    value={driverForm.phone}
                    onChange={e =>
                        setDriverForm({ ...driverForm, phone: e.target.value })
                    }
                />

                <input
                    placeholder="License Number"
                    value={driverForm.license_number}
                    onChange={e =>
                        setDriverForm({ ...driverForm, license_number: e.target.value })
                    }
                />

                <label>Driver License</label>
                <input type="file" />
            </Modal>

            {/* PASSWORD MODAL */}
            <Modal
                open={showPasswordModal}
                title="Update Password"
                onClose={() => setShowPasswordModal(false)}
                actions={
                    <>
                        <button
                            className={styles.cancelBtn}
                            onClick={() => setShowPasswordModal(false)}
                        >
                            Cancel
                        </button>
                        <button
                            className={`${styles.primaryBtn} mt-0`}
                            onClick={updatePassword}
                        >
                            Update
                        </button>
                    </>
                }
            >
                <input
                    type="password"
                    placeholder="New Password"
                    onChange={e => setNewPassword(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Confirm Password"
                    onChange={e => setConfirmPassword(e.target.value)}
                />
            </Modal>

        </div>
    );
};

export default DriverDetails;
