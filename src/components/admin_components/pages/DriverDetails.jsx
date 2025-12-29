import { useMemo, useState } from "react";
import styles from "../css/DriverDetails.module.css";
import Modal from "../widgets/Modal";

import { FiEdit2, FiTrash2, FiPlus, FiLock } from "react-icons/fi";

/* ---------------- MOCK DATA ---------------- */

const initialDrivers = [
    {
        id: 1,
        username: "driver_wlg_01",
        name: "John Smith",
        email: "john@email.com",
        phone: "0212345678",
        license: "NZDL-456789",
        status: "Active",
        documents: {}
    }
];

const emptyDriver = {
    name: "",
    email: "",
    phone: "",
    license: "",
    status: "Active",
    documents: {}
};

const DriverDetails = () => {
    /* ---------------- STATE ---------------- */

    const [drivers, setDrivers] = useState(initialDrivers);

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
        confirm: ""
    });

    const [driverForm, setDriverForm] = useState(emptyDriver);
    const [editingDriver, setEditingDriver] = useState(null);

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    /* ---------------- FILTER ---------------- */

    const filteredDrivers = useMemo(() => {
        return drivers.filter(d =>
            d.name.toLowerCase().includes(filterName.toLowerCase()) &&
            d.phone.includes(filterPhone) &&
            d.email.toLowerCase().includes(filterEmail.toLowerCase())
        );
    }, [drivers, filterName, filterPhone, filterEmail]);

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
        setShowDetailsModal(true);
    };

    const saveDriver = () => {
        if (!driverForm.name || !driverForm.phone) {
            alert("Name & phone required");
            return;
        }

        if (editingDriver) {
            setDrivers(drivers.map(d =>
                d.id === editingDriver.id ? { ...editingDriver, ...driverForm } : d
            ));
        } else {
            setDrivers([
                ...drivers,
                {
                    id: Date.now(),
                    username: loginForm.username,
                    ...driverForm
                }
            ]);
        }

        setShowDetailsModal(false);
    };

    const editDriver = (driver) => {
        setEditingDriver(driver);
        setDriverForm(driver);
        setShowDetailsModal(true);
    };

    const deleteDriver = (id) => {
        if (window.confirm("Delete this driver?")) {
            setDrivers(drivers.filter(d => d.id !== id));
        }
    };

    const updatePassword = () => {
        if (!validatePassword(newPassword, confirmPassword)) return;

        alert("Password updated");
        setShowPasswordModal(false);
        setNewPassword("");
        setConfirmPassword("");
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
                                    <input value={filterName} onChange={e => setFilterName(e.target.value)} />
                                </th>
                                <th>
                                    Phone
                                    <input value={filterPhone} onChange={e => setFilterPhone(e.target.value)} />
                                </th>
                                <th>
                                    Email
                                    <input value={filterEmail} onChange={e => setFilterEmail(e.target.value)} />
                                </th>
                                <th>License</th>
                                <th>Status</th>
                                <th className={styles.actionTd}>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredDrivers.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className={styles.noResults}>No results</td>
                                </tr>
                            ) : (
                                filteredDrivers.map(d => (
                                    <tr key={d.id}>
                                        <td>{d.name}</td>
                                        <td>{d.phone}</td>
                                        <td>{d.email}</td>
                                        <td>{d.license}</td>
                                        <td>{d.status}</td>
                                        <td className={styles.actionTd}>
                                            <button className={styles.iconBtn} onClick={() => editDriver(d)} title="Edit" ><FiEdit2 /></button>
                                            <button className={styles.iconBtn} onClick={() => setShowPasswordModal(true)} title="Change Password" ><FiLock /></button>
                                            <button className={styles.iconBtn} onClick={() => deleteDriver(d.id)} title="Delete" ><FiTrash2 /></button>
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
                            className={`${styles.primaryBtn} ${styles.mtZero}`}
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
                            className={`${styles.primaryBtn} ${styles.mtZero}`}
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
                    value={driverForm.license}
                    onChange={e =>
                        setDriverForm({ ...driverForm, license: e.target.value })
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
                            className={`${styles.primaryBtn} ${styles.mtZero}`}
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
