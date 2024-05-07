import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate, Link, useLocation } from "react-router-dom";
import PdfCard from "../PdfCard.js";
import { useAuthContext } from "../authContext.js";
import AddDrug from "./AddDrug.jsx";
import Footer from "../components/Footer.jsx";

function ViewDrug() {
  const userIdObj = useAuthContext();
  const userId = userIdObj.userId;
  const [drugs, setDrugs] = useState([]);
  const [isAddMedicationOpen, setIsAddMedicationOpen] = useState(false);
  // Read Drug Data
  useEffect(() => {
    if (userId && userId !== "logout")
      axios.get(`http://localhost:5555/users/${userId}/drugs`).then((res) => {
        setDrugs(res.data.data.drugs);
      });
  }, [userId]);

  const handleShowAddMedication = () => {
    setIsAddMedicationOpen(true);
  };

  const handleModalClose = () => {
    setIsAddMedicationOpen(false);
  };

  return (
    <>
      <div className="bg-primary-100 min-h-screen">
        <header className="pt-2.5 relative h-[54px] bg-white">
          <h1 className="ont-semibold text-lg text-center font-bold">
            Medication List
          </h1>
          {userId && userId !== "logout" ? <PdfCard drugs={drugs} /> : ""}
        </header>

        <nav>
          <p>Sorting options to be added here</p>
        </nav>
        <ul className="flex flex-col gap-y-2 mt-4">
          {drugs.map((drug) => (
            <Drug drug={drug} key={drug._id} />
          ))}
        </ul>
      </div>

      {/* Modal for add medication */}

      {isAddMedicationOpen ? (
        <>
          <div
            className="modal fixed z-10 top-0 left-0 bg-gray-800 opacity-80 w-full h-[120%]"
            onClick={handleModalClose}
          ></div>
          <div className="px-4 bg-white rounded-t-2xl h-[98vh] overflow-scroll	 w-full fixed bottom-0 z-20">
            <AddDrug />
          </div>
        </>
      ) : (
        <Footer />
      )}
    </>
  );
}

function Drug({ drug }) {
  const navigate = useNavigate();
  const frequencyDay = drug.takein.frequencyDay;
  const frequencyWithinADay = drug.takein.frequencyWithinADay;

  function handleClick(drug) {
    navigate(`/drugs/detail/${drug._id}`);
  }
  return (
    <>
      <div
        className="bg-white mx-4 rounded p-4"
        onClick={() => handleClick(drug)}
      >
        {/* <Navigate to={`/drugs/edit/${drug._id}`} /> */}
        <h3 className="text-gray-950 text-[19.98px] font-bold">
          {drug.drugName} {`: ${drug.status}`}
        </h3>
        <p>nickname</p>
        <p className="text-[11px] text-gray-500 font-medium">
          {drug.amount} {drug.unit} /{" "}
          {frequencyDay === 1
            ? "once"
            : frequencyDay === 2
            ? "twice"
            : frequencyDay === 3
            ? "3 times"
            : ""}{" "}
          in every
          {frequencyWithinADay === 1
            ? " day"
            : frequencyWithinADay > 1
            ? `${frequencyWithinADay} days`
            : ""}
        </p>
      </div>
    </>
  );
}

export default ViewDrug;
