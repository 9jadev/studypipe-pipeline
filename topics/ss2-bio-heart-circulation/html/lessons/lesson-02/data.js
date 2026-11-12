/* Lesson 02 · The Heart Up Close — sort items, explorer pins, results-table rows and the 12 quiz questions (03-questions.md § Lesson 02) */
(function () {
  "use strict";

  window.L02 = {
    // ---- 2A sort: which side of the heart? ----
    items: [
      { id: "tricuspid", name: "Tricuspid valve", emo: "R", bin: "right", why: "The tricuspid valve sits between the right atrium and the right ventricle (tRi = Right)." },
      { id: "bicuspid", name: "Bicuspid (mitral) valve", emo: "L", bin: "left", why: "The bicuspid valve has two flaps and guards the opening from the left atrium into the left ventricle." },
      { id: "cavae", name: "Venae cavae enter here", emo: "R", bin: "right", why: "Both venae cavae bring oxygen-poor blood from the body into the right atrium." },
      { id: "pveins", name: "Pulmonary veins enter here", emo: "L", bin: "left", why: "The four pulmonary veins bring oxygen-rich blood from the lungs into the left atrium." },
      { id: "aorta", name: "Aorta leaves here", emo: "L", bin: "left", why: "The aorta leaves the left ventricle and carries blood to the whole body." },
      { id: "pa", name: "Pulmonary artery leaves here", emo: "R", bin: "right", why: "The pulmonary artery leaves the right ventricle and carries blood to the lungs." },
      { id: "thick", name: "Thickest ventricle wall", emo: "L", bin: "left", why: "The left ventricle pushes blood round the whole body, so its wall has about three times the muscle of the right." },
      { id: "deoxy", name: "Holds deoxygenated blood", emo: "R", bin: "right", why: "The right atrium and right ventricle hold oxygen-poor blood on its way to the lungs." },
      { id: "chordae", name: "Chordae tendineae", emo: "B", bin: "both", why: "Both ventricles have cords tying the valve flaps to their papillary muscles." },
      { id: "semilunar", name: "Semilunar valve at the exit vessel", emo: "B", bin: "both", why: "A semilunar valve guards the aorta (left) and another guards the pulmonary artery (right)." }
    ],

    // ---- explorer pins (means come from DissectionBench.model at run time) ----
    pins: [
      { key: "ra", part: "raWall", label: "Right atrium", pumps: "the right ventricle", trip: "a few centimetres, straight down through the tricuspid valve", why: "It only has to squeeze blood a short way down, so a thin wall is enough." },
      { key: "la", part: "laWall", label: "Left atrium", pumps: "the left ventricle", trip: "a few centimetres, straight down through the bicuspid valve", why: "Another short squeeze, so another thin wall." },
      { key: "rv", part: "rvWall", label: "Right ventricle", pumps: "the lungs, by the pulmonary artery", trip: "a short trip to the lungs lying beside the heart", why: "A short, low-resistance route needs a moderate wall." },
      { key: "septum", part: "septum", label: "Septum", pumps: "nothing: it divides the two halves", trip: "no trip at all", why: "It is thick because it is the left ventricle's own wall, and it keeps right-side and left-side blood apart." },
      { key: "lv", part: "lvWall", label: "Left ventricle", pumps: "the whole body, by the aorta", trip: "from scalp to toes, through every organ", why: "The longest trip with the most resistance needs the thickest wall." }
    ],

    // ---- bench results table order and labels ----
    order: ["ra", "la", "rv", "lv", "septum"],
    names: { ra: "Right atrium (RA)", la: "Left atrium (LA)", rv: "Right ventricle (RV)", lv: "Left ventricle (LV)", septum: "Septum" },

    // the bench scene part highlighted for each region name
    partFor: { ra: "raWall", la: "laWall", rv: "rvWall", lv: "lvWall", septum: "septum" }
  };

  window.LESSON_QUIZ = [
 {
  "q": "Which layer of the heart is the thick band of muscle that contracts rhythmically all through life without tiring?",
  "o": [
   "Pericardium",
   "Endocardium",
   "Myocardium",
   "Septum"
  ],
  "a": 2,
  "e": "The myocardium is the middle layer of cardiac muscle that does the pumping and starts each beat itself. A (pericardium) is the two-layered bag around the heart, not muscle that contracts. B (endocardium) is the thin, smooth inner lining that lets blood slide past. D (septum) is the partition between the left and right halves, not one of the three layers of the wall."
 },
 {
  "q": "Dr Aisha tells Chidi that a thin film of fluid lies between the two layers of the pericardium. What is the main job of this fluid?",
  "o": [
   "It lets the layers slide over each other so the beating heart does not rub against the sac",
   "It supplies the heart muscle with oxygen and glucose",
   "It stops blood flowing backwards between the chambers",
   "It sends out the impulse that starts each heartbeat"
  ],
  "a": 0,
  "e": "The heart moves non-stop, so the slippery pericardial fluid reduces friction between the layers. B is the job of the coronary arteries, which bring oxygen and food to the heart muscle. C is the job of the valves. D is the job of the pacemaker, the sinoatrial node, which lies in the right atrium's wall."
 },
 {
  "q": "Blood that has just arrived in the left atrium has come directly from",
  "o": [
   "the body, through the venae cavae",
   "the right ventricle, through the septum",
   "the aorta, through the aortic semilunar valve",
   "the lungs, through the pulmonary veins"
  ],
  "a": 3,
  "e": "The four pulmonary veins bring oxygen-rich blood back from the lungs into the left atrium. A describes the right atrium, which receives the venae cavae. B is impossible: the septum is a solid wall that keeps the two halves apart. C runs the wrong way: the aorta carries blood <em>away</em> from the left ventricle, and its valve stops blood coming back."
 },
 {
  "q": "At the dissection bench, Chidi measures the left ventricle wall twice (10.2 mm and 9.8 mm) and the right ventricle wall twice (3.1 mm and 3.3 mm). To two significant figures, how many times thicker is the left ventricle wall?",
  "o": [
   "6.8",
   "3.1",
   "0.32",
   "31"
  ],
  "a": 1,
  "e": "Mean LV = (10.2 + 9.8) ÷ 2 = 10.0 mm. Mean RV = (3.1 + 3.3) ÷ 2 = 3.2 mm. Ratio = 10.0 ÷ 3.2 = 3.125 ≈ 3.1. A (10.0 − 3.2 = 6.8) gives the difference in mm, not \"how many times\". C (3.2 ÷ 10.0) divides the wrong way round. D is a ×10 slip. The answer fits the \"about three times\" rule."
 },
 {
  "q": "Why is the wall of the left ventricle much thicker than the wall of the right ventricle?",
  "o": [
   "The left ventricle holds a much larger volume of blood",
   "The left ventricle receives deoxygenated blood, which is heavier",
   "The left ventricle is on the right side of the body, which is the stronger side",
   "The left ventricle must force blood round the whole body, whereas the right ventricle sends blood only as far as the lungs close by"
  ],
  "a": 3,
  "e": "Wall thickness matches the distance and resistance the blood must be pushed against; the trip from the left ventricle reaches every organ from scalp to toes. A is wrong: both ventricles pump the same volume per beat, or blood would pile up in one circuit. B is wrong twice: the left ventricle holds <em>oxygenated</em> blood, and how much oxygen the blood carries has nothing to do with how thick a wall must be. C is Baba Sule's mistake: the left ventricle is on the patient's <em>left</em>."
 },
 {
  "q": "In the valve zoom, Dr Aisha cuts the chordae tendineae and the flaps flip backwards. What job do these cords normally do?",
  "o": [
   "They hold the atrioventricular valve flaps so they cannot be forced back up into the atria as the ventricles squeeze",
   "They pull the semilunar valves open when the ventricles relax",
   "They carry the electrical impulse from the atria to the ventricles",
   "They divide the heart into a right half and a left half"
  ],
  "a": 0,
  "e": "The cords tie the tricuspid and bicuspid flaps to the papillary muscles, so the high ventricular pressure shuts the flaps but cannot turn them inside out. B is wrong: the semilunar valves have no cords; they are pockets that fill and close on their own. C is the job of the conducting tissue (bundle of His and Purkinje fibres). D is the job of the septum."
 },
 {
  "q": "Blood leaves the chamber that receives both venae cavae and enters the chamber that pumps into the pulmonary artery. Which valve does it pass?",
  "o": [
   "Bicuspid (mitral) valve",
   "Aortic semilunar valve",
   "Tricuspid valve",
   "Pulmonary semilunar valve"
  ],
  "a": 2,
  "e": "The venae cavae enter the right atrium and the pulmonary artery leaves the right ventricle, so the blood passes the right atrioventricular valve, the tricuspid (\"tRi = Right\"). A guards the <em>left</em> atrioventricular opening. B sits at the base of the aorta. D sits at the exit of the right ventricle into the pulmonary artery, one step later than this question asks."
 },
 {
  "q": "In Chidi's front-view diagram, the chamber with the thickest wall and the aorta leaving it is drawn on the reader's right. Baba Sule says that proves it is the right ventricle. Which statement is correct?",
  "o": [
   "Baba Sule is correct, because the chamber is on the reader's right",
   "It is the left ventricle; a front-view diagram faces the reader, so the heart's left side appears on the reader's right",
   "It is the right atrium, because the atria have the thickest walls",
   "The diagram is wrong, because the left ventricle must always be drawn on the reader's left"
  ],
  "a": 1,
  "e": "A heart drawn facing you is like a person facing you: their left hand is on your right. The aorta and the thickest wall both identify the left ventricle. A is the sides trap the drawing rule warns about. C is wrong: the atria have the <em>thinnest</em> walls. D gets the rule backwards: in front view the left ventricle belongs on the reader's right, so Chidi's drawing is correct."
 },
 {
  "q": "Which vessel is an artery even though it carries deoxygenated blood?",
  "o": [
   "Pulmonary artery",
   "Aorta",
   "Pulmonary vein",
   "Superior vena cava"
  ],
  "a": 0,
  "e": "Arteries are named by direction (away from the heart), not by oxygen; the pulmonary artery takes oxygen-poor blood from the right ventricle to the lungs. B (aorta) is an artery carrying <em>oxygenated</em> blood. C is a vein that carries oxygenated blood, the matching exception. D is a vein carrying deoxygenated blood, so it follows the usual pattern."
 },
 {
  "q": "When measuring the left ventricle wall, Chidi placed his ruler where a papillary muscle joined the wall. How did this affect his reading?",
  "o": [
   "It made the reading too low, because a papillary muscle is hollow",
   "It had no effect, because the papillary muscle is part of the wall",
   "It made the reading too low, because the cut there was slanting",
   "It made the reading too high, because muscle that is not wall was added to the measurement"
  ],
  "a": 3,
  "e": "A papillary muscle juts inwards from the wall, so measuring through it adds extra tissue and the wall reads too thick; every wall should be measured clear of these bulges, at the same height. A is wrong: papillary muscles are solid. B is wrong: they project into the cavity and are not counted as wall thickness. C mixes in a different error (a slanting cut) and also gets its direction wrong: a slanting cut makes a wall read too <em>high</em>."
 },
 {
  "q": "Baba Sule's goat heart is 7.5 cm long from base to apex. Chidi's drawing of it is 150 mm long. What is the magnification of the drawing?",
  "o": [
   "×0.5",
   "×2.0",
   "×20",
   "2.0 cm"
  ],
  "a": 1,
  "e": "Same units: 150 mm = 15.0 cm. Magnification = drawing length ÷ actual length = 15.0 ÷ 7.5 = ×2.0. A divides actual by drawing, the wrong way round. C divides 150 by 7.5 without converting mm to cm, a ×10 slip. D gives the right number with a unit; magnification has no unit, so the mark is lost."
 },
 {
  "q": "On a ×2.5 drawing of a goat heart, the right ventricle wall measures 11 mm thick. What is its actual thickness?",
  "o": [
   "27.5 mm",
   "44 mm",
   "4.4 mm",
   "8.5 mm"
  ],
  "a": 2,
  "e": "Actual size = drawing size ÷ magnification = 11 mm ÷ 2.5 = 4.4 mm. A multiplies instead of dividing, which would make the real wall bigger than the drawing of it. B is a ×10 slip. D subtracts the magnification (11 − 2.5), which has no meaning."
 }
];
})();
