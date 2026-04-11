// src/components/HomeDoctors/HomeDoctors.jsx

import React, { useEffect, useState } from "react";
import { Medal, ChevronsRight, MousePointer2Off } from "lucide-react";
import { Link } from "react-router-dom";
import { homeDoctorsStyles, iconSize } from "../../assets/dummyStyles";

const HomeDoctors = ({ apiBase, previewCount = 8 }) => {
  const API_BASE =
    apiBase || "http://localhost:4000";

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ FIXED FETCH WITH PROPER RETRY
  const fetchDoctors = async (retryCount = 3) => {
    try {
      const res = await fetch(`${API_BASE}/api/doctors`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Server waking up...");

      const json = await res.json().catch(() => null);
      const items = (json && (json.data || json)) || [];

      const normalized = (Array.isArray(items) ? items : []).map((d) => {
        const id = d._id || d.id;

        const image =
          d.imageUrl || d.image || d.imageSmall || d.imageSrc || "";

        const available =
          (typeof d.availability === "string"
            ? d.availability.toLowerCase() === "available"
            : typeof d.available === "boolean"
            ? d.available
            : d.availability === true) ||
          d.availability === "Available";

        return {
          id,
          name: d.name || "Unknown",
          specialization: d.specialization || "",
          image,
          experience:
            d.experience || d.experience === 0
              ? String(d.experience)
              : "",
          fee: d.fee ?? d.price ?? 0,
          available,
          raw: d,
        };
      });

      setDoctors(normalized);
      setError("");
      setLoading(false); // ✅ ONLY on success
    } catch (err) {
      console.log("Retrying...", retryCount);

      if (retryCount > 0) {
        setError("Server is waking up... please wait ⏳");

        setTimeout(() => {
          fetchDoctors(retryCount - 1);
        }, 2000);
      } else {
        setError("Failed to load doctors. Please try again.");
        setDoctors([]);
        setLoading(false); // ✅ ONLY on final failure
      }
    }
  };

  // ✅ LOAD ON FIRST RENDER
  useEffect(() => {
    setLoading(true);
    fetchDoctors();
  }, [API_BASE]);

  const preview = doctors?.slice(0, previewCount) || [];

  return (
    <section className={homeDoctorsStyles.section}>
      <div className={homeDoctorsStyles.container}>
        <div className={homeDoctorsStyles.header}>
          <h1 className={homeDoctorsStyles.title}>
            Our{" "}
            <span className={homeDoctorsStyles.titleSpan}>
              Medical Team
            </span>
          </h1>
          <p className={homeDoctorsStyles.subtitle}>
            Book appointments quickly with our verified specialists.
          </p>
        </div>

        {/* ❌ ERROR */}
        {error && (
          <div className={homeDoctorsStyles.errorContainer}>
            <div className={homeDoctorsStyles.errorText}>{error}</div>

            <button
              onClick={() => {
                setLoading(true);
                fetchDoctors();
              }}
              className={homeDoctorsStyles.retryButton}
            >
              Retry
            </button>
          </div>
        )}

        {/* 🔄 LOADING */}
        {loading ? (
          <div className={homeDoctorsStyles.skeletonGrid}>
            {Array.from({ length: previewCount }).map((_, i) => (
              <div key={i} className={homeDoctorsStyles.skeletonCard}>
                <div className={homeDoctorsStyles.skeletonImage} />
                <div className={homeDoctorsStyles.skeletonText1} />
                <div className={homeDoctorsStyles.skeletonText2} />
                <div className="flex gap-2 mt-auto">
                  <div className={homeDoctorsStyles.skeletonButton} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* ✅ DOCTORS GRID */
          <div className={homeDoctorsStyles.doctorsGrid}>
            {preview.map((doctor) => (
              <article
                key={doctor.id || doctor.name}
                className={homeDoctorsStyles.article}
              >
                {doctor.available ? (
                  <Link
                    to={`/doctors/${doctor.id}`}
                    state={{ doctor: doctor.raw || doctor }}
                  >
                    <div className={homeDoctorsStyles.imageContainerAvailable}>
                      <img
                        src={doctor.image || "/placeholder-doctor.jpg"}
                        alt={doctor.name}
                        className={homeDoctorsStyles.image}
                      />
                    </div>
                  </Link>
                ) : (
                  <div className={homeDoctorsStyles.imageContainerUnavailable}>
                    <img
                      src={doctor.image || "/placeholder-doctor.jpg"}
                      alt={doctor.name}
                      className={homeDoctorsStyles.image}
                    />
                    <div className={homeDoctorsStyles.unavailableBadge}>
                      Not available
                    </div>
                  </div>
                )}

                <div className={homeDoctorsStyles.cardBody}>
                  <h3 className={homeDoctorsStyles.doctorName}>
                    {doctor.name}
                  </h3>

                  <p className={homeDoctorsStyles.specialization}>
                    {doctor.specialization}
                  </p>

                  <div className={homeDoctorsStyles.experienceContainer}>
                    <div className={homeDoctorsStyles.experienceBadge}>
                      <Medal className={`${iconSize.small} h-4`} />
                      <span>
                        {doctor.experience} years Experience
                      </span>
                    </div>
                  </div>

                  <div className={homeDoctorsStyles.buttonContainer}>
                    {doctor.available ? (
                      <Link
                        to={`/doctors/${doctor.id}`}
                        state={{ doctor: doctor.raw || doctor }}
                        className={homeDoctorsStyles.buttonAvailable}
                      >
                        <ChevronsRight className="w-5 h-5" />
                        Book Now
                      </Link>
                    ) : (
                      <button
                        disabled
                        className={homeDoctorsStyles.buttonUnavailable}
                      >
                        <MousePointer2Off className="w-5 h-5" />
                        Not Available
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <style>{homeDoctorsStyles.customCSS}</style>
    </section>
  );
};

export default HomeDoctors;