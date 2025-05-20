import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import './AdminStyles.css';

export function Admin() {
  // Données des groupes d'étudiants
  const groupes = [
    { id: 1, nom: "Groupe A" },
    { id: 2, nom: "Groupe B" },
    { id: 3, nom: "Groupe C" },
    { id: 4, nom: "Groupe D" }
  ];

  // Données des étudiants par groupe
  const etudiantsParGroupe = {
    1: [
      { id: 1, nom: "Dupont", prenom: "Jean" },
      { id: 2, nom: "Martin", prenom: "Sophie" },
      { id: 3, nom: "Dubois", prenom: "Marie" },
      { id: 4, nom: "Leroy", prenom: "Thomas" }
    ],
    2: [
      { id: 5, nom: "Moreau", prenom: "Camille" },
      { id: 6, nom: "Simon", prenom: "Lucas" },
      { id: 7, nom: "Petit", prenom: "Emma" }
    ],
    3: [
      { id: 8, nom: "Roux", prenom: "Hugo" },
      { id: 9, nom: "Bonnet", prenom: "Léa" },
      { id: 10, nom: "Girard", prenom: "Nathan" }
    ],
    4: [
      { id: 11, nom: "Lambert", prenom: "Chloé" },
      { id: 12, nom: "Fournier", prenom: "Jules" },
      { id: 13, nom: "Michel", prenom: "Inès" }
    ]
  };

  // Horaires de cours
  const horaires = [
    { id: 1, heure: "8h - 10h" },
    { id: 2, heure: "10h - 12h" },
    { id: 3, heure: "13h - 15h" },
    { id: 4, heure: "15h - 18h" }
  ];

  // État pour le groupe sélectionné
  const [groupeSelectionne, setGroupeSelectionne] = useState("");
  
  // État pour la date sélectionnée
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // État pour stocker les absences par date
  const [absencesParDate, setAbsencesParDate] = useState({});

  // Gestion du changement de groupe
  const handleGroupeChange = (e) => {
    setGroupeSelectionne(e.target.value);
  };

  // Gestion du changement de date
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  // Gestion du cochage des absences
  const handleAbsenceChange = (etudiantId, horaireId) => {
    const dateKey = selectedDate.toISOString().split('T')[0];
    const absenceKey = `${etudiantId}-${horaireId}`;
    
    setAbsencesParDate(prev => ({
      ...prev,
      [dateKey]: {
        ...prev[dateKey],
        [absenceKey]: !(prev[dateKey]?.[absenceKey])
      }
    }));
  };

  // Obtenir les étudiants du groupe sélectionné
  const etudiantsAffiches = groupeSelectionne ? etudiantsParGroupe[groupeSelectionne] : [];

  // Obtenir les absences pour la date sélectionnée
  const getAbsencesForDate = () => {
    const dateKey = selectedDate.toISOString().split('T')[0];
    return absencesParDate[dateKey] || {};
  };

  // Date formatée pour l'affichage
  const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  const dateFormatee = selectedDate.toLocaleDateString('fr-FR', options);

  // Fonction pour enregistrer les absences
  const enregistrerAbsences = () => {
    alert("Absences enregistrées avec succès!");
    console.log("Absences enregistrées:", absencesParDate);
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Gestion des étudiants</h1>
        <button className="logout-button">Déconnexion</button>
      </div>
      
      <div className="date-selection">
        <label htmlFor="date">Sélectionner une date :</label>
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          dateFormat="dd/MM/yyyy"
          maxDate={new Date()}
          className="date-picker"
        />
      </div>

      <div className="groupe-selection">
        <label htmlFor="groupe">Sélectionner un groupe :</label>
        <select 
          id="groupe" 
          value={groupeSelectionne} 
          onChange={handleGroupeChange}
        >
          <option value="">Sélectionnez un groupe</option>
          {groupes.map(groupe => (
            <option key={groupe.id} value={groupe.id}>
              {groupe.nom}
            </option>
          ))}
        </select>
      </div>

      {groupeSelectionne && (
        <div className="absence-section">
          <h2>Liste des étudiants - {groupes.find(g => g.id.toString() === groupeSelectionne).nom}</h2>
          <p className="date-info">Date: {dateFormatee}</p>
          
          <table className="etudiants-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Prénom</th>
                {horaires.map(horaire => (
                  <th key={horaire.id}>{horaire.heure}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {etudiantsAffiches.map(etudiant => (
                <tr key={etudiant.id}>
                  <td>{etudiant.nom}</td>
                  <td>{etudiant.prenom}</td>
                  {horaires.map(horaire => {
                    const absenceKey = `${etudiant.id}-${horaire.id}`;
                    const currentAbsences = getAbsencesForDate();
                    return (
                      <td key={horaire.id} className="absence-cell">
                        <input
                          type="checkbox"
                          id={absenceKey}
                          checked={!!currentAbsences[absenceKey]}
                          onChange={() => handleAbsenceChange(etudiant.id, horaire.id)}
                        />
                        <label htmlFor={absenceKey}>Absent</label>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className="actions">
            <button className="save-button" onClick={enregistrerAbsences}>
              Enregistrer les absences
            </button>
          </div>
        </div>
      )}
    </div>
  );
}