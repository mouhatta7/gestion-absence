import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import './AdminStyles.css';
import axios from 'axios';

export function Admin() {
  // État pour tous les stagiaires
  const [stagiaires, setStagiaires] = useState([]);
  
  // État pour les codes diplôme uniques
  const [codesDiplome, setCodesDiplome] = useState([]);
  
  // État pour le code diplôme sélectionné
  const [codeDiplomeSelectionne, setCodeDiplomeSelectionne] = useState("");
  
  // État pour les stagiaires filtrés
  const [stagiairesAffiches, setStagiairesAffiches] = useState([]);
  
  // État pour la date sélectionnée
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // État pour stocker les absences par date
  const [absencesParDate, setAbsencesParDate] = useState({});

  // État pour contrôler l'affichage détaillé de chaque étudiant
  const [expandedRows, setExpandedRows] = useState({});

  // Nouveaux horaires selon vos spécifications
  const horaires = [
    { id: 1, heure: "8:30-9" },
    { id: 2, heure: "9-10" },
    { id: 3, heure: "10-11" },
    { id: 4, heure: "11-12:30" },
    { id: 5, heure: "12:30-13:30" },
    { id: 6, heure: "13:30-14:30" },
    { id: 7, heure: "14:30-15:30" },
    { id: 8, heure: "15:30-16" },
    { id: 9, heure: "16-17:30" },
    { id: 10, heure: "17:30-18:30" }
  ];

  // Charger les stagiaires au montage du composant
  useEffect(() => {
    const fetchStagiaires = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/stagiaires');
        
        if (response.data.success) {
          setStagiaires(response.data.data);
          
          // Extraire les codes diplôme uniques et les trier
          const uniqueCodesDiplome = [...new Set(response.data.data.map(stagiaire => stagiaire.CodeDiplome))]
            .filter(code => code) // Filtrer les valeurs vides
            .sort((a, b) => a.localeCompare(b, 'fr', { sensitivity: 'base' })); // Tri alphabétique
          setCodesDiplome(uniqueCodesDiplome);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des stagiaires:', error);
      }
    };

    fetchStagiaires();
  }, []);

  // Filtrer les stagiaires par code diplôme avec tri alphabétique
  useEffect(() => {
    if (codeDiplomeSelectionne) {
      const stagiairesFiltrés = stagiaires
        .filter(stagiaire => stagiaire.CodeDiplome === codeDiplomeSelectionne)
        .sort((a, b) => {
          // Tri par nom puis par prénom
          const nomComparison = a.Nom.localeCompare(b.Nom, 'fr', { sensitivity: 'base' });
          if (nomComparison !== 0) {
            return nomComparison;
          }
          return a.Prenom.localeCompare(b.Prenom, 'fr', { sensitivity: 'base' });
        });
      setStagiairesAffiches(stagiairesFiltrés);
    } else {
      setStagiairesAffiches([]);
    }
  }, [codeDiplomeSelectionne, stagiaires]);

  // Gestion du changement de code diplôme
  const handleCodeDiplomeChange = (e) => {
    setCodeDiplomeSelectionne(e.target.value);
    setExpandedRows({}); // Réinitialiser l'affichage étendu
  };

  // Gestion du changement de date
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  // Gestion de l'expansion/contraction des lignes
  const toggleRowExpansion = (matricule) => {
    setExpandedRows(prev => ({
      ...prev,
      [matricule]: !prev[matricule]
    }));
  };

  // Gestion du cochage des absences
  const handleAbsenceChange = (matriculeEtudiant, horaireId) => {
    const dateKey = selectedDate.toISOString().split('T')[0];
    const absenceKey = `${matriculeEtudiant}-${horaireId}`;
    
    setAbsencesParDate(prev => ({
      ...prev,
      [dateKey]: {
        ...prev[dateKey],
        [absenceKey]: !(prev[dateKey]?.[absenceKey])
      }
    }));
  };

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
    const dateKey = selectedDate.toISOString().split('T')[0];
    const absencesDate = absencesParDate[dateKey] || {};
    
    // Créer un objet avec les données à enregistrer
    const absencesAEnregistrer = {
      date: dateKey,
      codeDiplome: codeDiplomeSelectionne,
      absences: Object.keys(absencesDate).filter(key => absencesDate[key]).map(key => {
        const [matricule, horaireId] = key.split('-');
        const stagiaire = stagiairesAffiches.find(s => s.MatriculeEtudiant === matricule);
        return {
          matricule,
          nom: stagiaire?.Nom,
          prenom: stagiaire?.Prenom,
          horaireId,
          heure: horaires.find(h => h.id === parseInt(horaireId))?.heure
        };
      })
    };
    
    alert("Absences enregistrées avec succès!");
    console.log("Absences enregistrées:", absencesAEnregistrer);
    
    // TODO: Envoyer les données au backend
    // await axios.post('http://127.0.0.1:8000/api/absences', absencesAEnregistrer);
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
        <label htmlFor="codeDiplome">Sélectionner un diplôme :</label>
        <select 
          id="codeDiplome" 
          value={codeDiplomeSelectionne} 
          onChange={handleCodeDiplomeChange}
        >
          <option value="">Sélectionnez un code diplôme</option>
          {codesDiplome.map(code => (
            <option key={code} value={code}>
              {code}
            </option>
          ))}
        </select>
      </div>

      {codeDiplomeSelectionne && (
        <div className="absence-section">
          <h2>Liste des étudiants - {codeDiplomeSelectionne}</h2>
          <p className="date-info">Date: {dateFormatee}</p>
          <p className="count-info">Nombre d'étudiants: {stagiairesAffiches.length}</p>
          
          <div className="table-container">
            <table className="etudiants-table">
              <thead>
                <tr>
                  <th>Action</th>
                  <th>Nom</th>
                  <th>Prénom</th>
                  <th>Sexe</th>
                  {horaires.map(horaire => (
                    <th key={horaire.id}>{horaire.heure}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stagiairesAffiches.map(stagiaire => (
                  <React.Fragment key={stagiaire.MatriculeEtudiant}>
                    {/* Ligne principale (toujours visible) */}
                    <tr className="main-row">
                      <td>
                        <button 
                          className="toggle-button"
                          onClick={() => toggleRowExpansion(stagiaire.MatriculeEtudiant)}
                        >
                          {expandedRows[stagiaire.MatriculeEtudiant] ? 'Voir moins' : 'Voir plus'}
                        </button>
                      </td>
                      <td className="student-name">{stagiaire.Nom}</td>
                      <td className="student-firstname">{stagiaire.Prenom}</td>
                      <td className="student-sex">{stagiaire.Sexe}</td>
                      {horaires.map(horaire => {
                        const absenceKey = `${stagiaire.MatriculeEtudiant}-${horaire.id}`;
                        const currentAbsences = getAbsencesForDate();
                        return (
                          <td key={horaire.id} className="absence-cell">
                            <input
                              type="checkbox"
                              id={absenceKey}
                              checked={!!currentAbsences[absenceKey]}
                              onChange={() => handleAbsenceChange(stagiaire.MatriculeEtudiant, horaire.id)}
                            />
                            <label htmlFor={absenceKey}>Absent</label>
                          </td>
                        );
                      })}
                    </tr>
                    
                    {/* Ligne détaillée (conditionnellement visible) */}
                    {expandedRows[stagiaire.MatriculeEtudiant] && (
                      <tr className="detail-row">
                        <td colSpan={4 + horaires.length}>
                          <div className="student-details">
                            <div className="detail-grid">
                              <div className="detail-item">
                                <strong>Matricule:</strong> {stagiaire.MatriculeEtudiant}
                              </div>
                              <div className="detail-item">
                                <strong>Date de naissance:</strong> {stagiaire.DateNaissance}
                              </div>
                              <div className="detail-item">
                                <strong>Lieu de naissance:</strong> {stagiaire.LieuNaissance}
                              </div>
                              <div className="detail-item">
                                <strong>Téléphone:</strong> {stagiaire.NTelelephone}
                              </div>
                              <div className="detail-item">
                                <strong>CIN:</strong> {stagiaire.CIN}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
          
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