import { useSignUp } from "@clerk/clerk-react";
import { useState } from "react";

export default function CustomSignUp() {
  const { isLoaded, signUp, setActive } = useSignUp();

  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [role, setRole] = useState("hr");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");

  if (!isLoaded) return null;

  // Step 1 - create Clerk account
  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await signUp.create({
        emailAddress: email,
        password,
      });
      await signUp.prepareEmailAddressVerification();
      setPendingVerification(true);
    } catch (err) {
      console.error("SignUp error:", err.errors || err);
    }
  };

  // Step 2 - verify and call Flask backend
  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });

        // call Flask backend
        const res = await fetch("http://localhost:5000/register_user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            email,
            company_name: companyName,
            role,
          }),
        });

        const data = await res.json();
        console.log("Backend response:", data);

        // redirect after successful signup
        window.location.href = "/dashboard";
      }
    } catch (err) {
      console.error("Verification error:", err.errors || err);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="w-96 bg-white shadow-lg rounded-2xl p-6">
        {!pendingVerification ? (
          <form onSubmit={handleSignUp}>
            <h2 className="text-2xl font-bold mb-4">Create Account</h2>

            <input
              type="text"
              placeholder="Full Name"
              className="border p-2 w-full mb-3 rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <input
              type="text"
              placeholder="Company Name"
              className="border p-2 w-full mb-3 rounded"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
            />

            <select
              className="border p-2 w-full mb-3 rounded"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="hr">HR</option>
              <option value="manager">Manager</option>
              <option value="employee">Employee</option>
            </select>

            <input
              type="email"
              placeholder="Email"
              className="border p-2 w-full mb-3 rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              className="border p-2 w-full mb-3 rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Sign Up
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify}>
            <h2 className="text-xl font-bold mb-4">Verify Email</h2>
            <input
              type="text"
              placeholder="Enter verification code"
              className="border p-2 w-full mb-3 rounded"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
            >
              Verify & Continue
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
