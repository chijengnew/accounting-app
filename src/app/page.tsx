"use client";

import { useState, type SubmitEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { FirebaseError } from "firebase/app";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";

const ERROR_MESSAGES: Record<string, string> = {
    "auth/email-already-in-use": "This email address is already in use.",
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/weak-password": "Password must be at least 6 characters long.",
    "auth/invalid-credential": "Incorrect email or password.",
    "auth/user-not-found": "Incorrect email or password.",
    "auth/wrong-password": "Incorrect email or password.",
    "auth/popup-blocked": "The sign-in pop-up was blocked. Please allow pop-ups for this site and try again.",
    "auth/unauthorized-domain": "This domain is not authorized for Google sign-in.",
};

const SILENT_ERRORS = [
    "auth/popup-closed-by-user",
    "auth/cancelled-popup-request",
    "auth/user-cancelled",
];

type Mode = "login" | "register";

export default function Home() {
    const user = useAuth();
    const [mode, setMode] = useState<Mode>("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    function toggleMode() {
        setMode(mode === "login" ? "register" : "login");
        setError("");
        setEmail("");
        setPassword("");
    }

    function showError(err: unknown) {
        const code = err instanceof FirebaseError ? err.code : "";
        if (SILENT_ERRORS.includes(code)) return;
        setError(ERROR_MESSAGES[code] ?? "Something went wrong. Please try again.");
    }

    async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");
        try {
            if (mode === "register") {
                await createUserWithEmailAndPassword(auth, email, password);
            } else {
                await signInWithEmailAndPassword(auth, email, password);
            }
            setPassword("");
        } catch (err) {
            showError(err);
        }
    }

    async function handleGoogleSignIn() {
        try {
            await signInWithPopup(auth, new GoogleAuthProvider());
        } catch (err) {
            showError(err);
        }
    }

    async function handleSignOut() {
        await signOut(auth);
        setMode("login");
        setEmail("");
        setPassword("");
        setError("");
    }

    return (
        <main className="home">
            <div className="home-art">
                <Image
                    src="/money-chase.svg"
                    alt="A person running while a banknote and coins chase after them"
                    width={600}
                    height={280}
                    className="art-image"
                    priority
                />
            </div>

            <div className="home-intro">
                <h1 className="home-title">Stay on top of your finances</h1>
                <p className="home-subtitle">Every transaction, accounted for.</p>
            </div>

            <section className="card auth-card">
                {user === undefined && <p className="page-status">Loading...</p>}

                {user && (
                    <div className="auth-panel">
                        <p className="field-label">Signed in as</p>
                        <p className="auth-email">{user.email}</p>
                        <div className="auth-actions">
                            <Link href="/accounting" className="btn btn-primary">Get started</Link>
                            <button type="button" className="btn btn-secondary" onClick={handleSignOut}>
                                Sign out
                            </button>
                        </div>
                    </div>
                )}

                {user === null && (
                    <form className="auth-form" onSubmit={handleSubmit}>
                        <h2 className="auth-title">{mode === "login" ? "Sign in" : "Create account"}</h2>
                        <div className="field">
                            <label htmlFor="email">Email</label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="password">Password</label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                minLength={6}
                                required
                            />
                        </div>
                        {error && <p className="form-error" role="alert">{error}</p>}
                        <button type="submit" className="btn btn-primary">
                            {mode === "login" ? "Sign in" : "Create account"}
                        </button>
                        <div className="divider">or</div>
                        <button type="button" className="btn btn-secondary" onClick={handleGoogleSignIn}>
                            Sign in with Google
                        </button>
                        <button type="button" className="btn-link" onClick={toggleMode}>
                            {mode === "login" ? "Don't have an account? Create one" : "Already have an account? Sign in"}
                        </button>
                    </form>
                )}
            </section>
        </main>
    );
}