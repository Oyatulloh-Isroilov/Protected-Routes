import React, { useRef, useState } from 'react';
import './register.css';
import { Link, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

function Register() {
    const [btnClicked, setBtnClicked] = useState(false);
    const nameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const navigate = useNavigate();

    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);
    const [err, setErr] = useState("")

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
        setErr("")
    };

    function validate() {

        if (!nameRef.current.value || !emailRef.current.value || !passwordRef.current.value) {
            setError("Ma'lumotlar to'liq kiriting!");
            return false;
        }
        return true;
    }

    function handleClick(e) {
        e.preventDefault();
        setBtnClicked(true);

        if (!validate()) {
            setBtnClicked(false);
            return;
        }

        const user = {
            username: nameRef.current.value,
            email: emailRef.current.value,
            password: passwordRef.current.value,
        };

        fetch("https://auth-rg69.onrender.com/api/auth/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=utf-8"
            },
            body: JSON.stringify(user)
        })
            .then(res => res.json())
            .then((data) => {
                setBtnClicked(false);

                if (data.message == "User registered successfully!") {
                    navigate("/Login")
                }

                if (data.message == 'Failed! Username is already in use!') {
                    handleClickOpen();
                    setErr(data.message);
                }

                if (data.message == "Failed! Email is already in use!") {
                    handleClickOpen();
                    setErr(data.message);
                }
            })


            .catch(error => {
                console.error(error);
                setBtnClicked(false)
                setError("API bilan bog'liq xatolik bo'ldi");
            });
    }

    return (
        <>
            <div className="container">
                <div className="card">
                    <div className="card_title">
                        <h1>Create Account</h1>
                        <span>Already have an account? </span><Link to={"/Login"}>Sign In</Link>
                    </div>
                    <div className="form">
                        <form action="/register" method="post">
                            <input ref={nameRef} type="text" name="username" id="username" placeholder="Username" />
                            <input ref={emailRef} type="email" name="email" placeholder="Email" id="email" />
                            <input ref={passwordRef} type="password" name="password" placeholder="Password" id="password" />
                            <button disabled={btnClicked ? true : false} onClick={handleClick} className='registerBtn'>Register</button>
                        </form>
                    </div>
                    <div className="card_terms">
                        <input type="checkbox" id="terms" />
                        <span>I have read and agree to the <a href='#'>Terms of Service</a></span>
                    </div>
                </div>
            </div>

            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
            >
                <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                    Error
                </DialogTitle>
                <DialogContent dividers>
                    <Typography gutterBottom>
                        {err}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={handleClose}>
                        Close
                    </Button>
                </DialogActions>
            </BootstrapDialog>

        </>
    );
}

export default Register;
