import './App.css';
import { useState } from 'react';
import { ethers } from 'ethers';
import { contractAddress, abi }
from './contract';

function App() {

  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [email, setEmail] = useState("");
  const [studentId, setStudentId] = useState("");
  const [student, setStudent] = useState(null);

  async function getContract() {

    await window.ethereum.request({
      method: "eth_requestAccounts"
    });

    const provider =
      new ethers.BrowserProvider(
        window.ethereum
      );

    const signer =
      await provider.getSigner();

    return new ethers.Contract(
      contractAddress,
      abi,
      signer
    );
  }

  async function addStudent() {

    const contract =
      await getContract();

    const tx =
      await contract.addStudent(
        name,
        course,
        email
      );

    await tx.wait();

    alert("Student Added");
  }

  async function requestLoR() {

    const contract =
      await getContract();

    const tx =
      await contract.requestRecommendation(
        studentId
      );

    await tx.wait();

    alert("Requested");
  }

  async function approveLoR() {

    const contract =
      await getContract();

    const tx =
      await contract.approveRecommendation(
        studentId
      );

    await tx.wait();

    alert("Approved");
  }

  async function getStudent() {

    const contract =
      await getContract();

    const result =
      await contract.getStudent(
        studentId
      );

    setStudent(result);
  }

  return (
    <div className="container">

      <h1>LoR DApp</h1>

      <h2>Add Student</h2>

      <input
        placeholder="Name"
        onChange={(e)=>
          setName(e.target.value)}
      />

      <input
        placeholder="Course"
        onChange={(e)=>
          setCourse(e.target.value)}
      />

      <input
        placeholder="Email"
        onChange={(e)=>
          setEmail(e.target.value)}
      />

      <button onClick={addStudent}>
        Add Student
      </button>

      <hr />

      <h2>Student ID</h2>

      <input
        placeholder="ID"
        onChange={(e)=>
          setStudentId(e.target.value)}
      />

      <button onClick={requestLoR}>
        Request
      </button>

      <button onClick={approveLoR}>
        Approve
      </button>

      <button onClick={getStudent}>
        View
      </button>

      {student && (
        <div>
          <h3>Student Details</h3>

          <p>Name: {student[1]}</p>
          <p>Course: {student[2]}</p>
          <p>Email: {student[3]}</p>

          <p>
            Requested:
            {student[4].toString()}
          </p>

          <p>
            Approved:
            {student[5].toString()}
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
