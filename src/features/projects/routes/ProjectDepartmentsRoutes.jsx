import { lazy } from 'react';

const ProjectDepartments = lazy(() => import('../pages/ProjectDepartments/ProjectDepartments'));

// const ProjectDepartmentAccounts = lazy(() => import("../pages/ProjectDepartments/projectDepartmentAccounts"));
// const ProjectDepartmentActionVehicles = lazy(() => import("../pages/ProjectDepartments/projectDepartmentActionVehicles"));
// const ProjectDepartmentAerial = lazy(() => import("../pages/ProjectDepartments/projectDepartmentAerial"));
// const ProjectDepartmentAnimals = lazy(() => import("../pages/ProjectDepartments/projectDepartmentAnimals"));
// const ProjectDepartmentAnimation = lazy(() => import("../pages/ProjectDepartments/projectDepartmentAnimation"));
// const ProjectDepartmentArmoury = lazy(() => import("../pages/ProjectDepartments/projectDepartmentArmoury"));
// const ProjectDepartmentArt = lazy(() => import("../pages/ProjectDepartments/projectDepartmentArt"));
// const ProjectDepartmentAssets = lazy(() => import("../pages/ProjectDepartments/projectDepartmentAssets"));
// const ProjectDepartmentAssistantDirectors = lazy(() => import("../pages/ProjectDepartments/projectDepartmentAssistantDirectors"));
// const ProjectDepartmentCamera = lazy(() => import("../pages/ProjectDepartments/projectDepartmentCamera"));
// const ProjectDepartmentCast = lazy(() => import("../pages/ProjectDepartments/projectDepartmentCast"));
// const ProjectDepartmentChaperones = lazy(() => import("../pages/ProjectDepartments/projectDepartmentChaperones"));
// const ProjectDepartmentChoreography = lazy(() => import("../pages/ProjectDepartments/projectDepartmentChoreography"));
// const ProjectDepartmentClearances = lazy(() => import("../pages/ProjectDepartments/projectDepartmentClearances"));
// const ProjectDepartmentComputerGraphics = lazy(() => import("../pages/ProjectDepartments/projectDepartmentComputerGraphics"));
// const ProjectDepartmentConstruction = lazy(() => import("../pages/ProjectDepartments/projectDepartmentConstruction"));
// const ProjectDepartmentContinuity = lazy(() => import("../pages/ProjectDepartments/projectDepartmentContinuity"));
// const ProjectDepartmentCostume = lazy(() => import("../pages/ProjectDepartments/projectDepartmentCostume"));
// const ProjectDepartmentCostumeFx = lazy(() => import("../pages/ProjectDepartments/projectDepartmentCostumeFx"));
// const ProjectDepartmentCovidSafety = lazy(() => import("../pages/ProjectDepartments/projectDepartmentCovidSafety"));
// const ProjectDepartmentCreatureEffects = lazy(() => import("../pages/ProjectDepartments/projectDepartmentCreatureEffects"));
// const ProjectDepartmentDit = lazy(() => import("../pages/ProjectDepartments/projectDepartmentDit"));
// const ProjectDepartmentDigitalAssets = lazy(() => import("../pages/ProjectDepartments/projectDepartmentDigitalAssets"));
// const ProjectDepartmentDigitalPlayback = lazy(() => import("../pages/ProjectDepartments/projectDepartmentDigitalPlayback"));
// const ProjectDepartmentDirector = lazy(() => import("../pages/ProjectDepartments/projectDepartmentDirector"));
// const ProjectDepartmentDocumentary = lazy(() => import("../pages/ProjectDepartments/projectDepartmentDocumentary"));
// const ProjectDepartmentDrapes = lazy(() => import("../pages/ProjectDepartments/projectDepartmentDrapes"));
// const ProjectDepartmentEpk = lazy(() => import("../pages/ProjectDepartments/projectDepartmentEpk"));
// const ProjectDepartmentEditorial = lazy(() => import("../pages/ProjectDepartments/projectDepartmentEditorial"));
// const ProjectDepartmentElectrical = lazy(() => import("../pages/ProjectDepartments/projectDepartmentElectrical"));
// const ProjectDepartmentElectricalRigging = lazy(() => import("../pages/ProjectDepartments/projectDepartmentElectricalRigging"));
// const ProjectDepartmentFranchise = lazy(() => import("../pages/ProjectDepartments/projectDepartmentFranchise"));
// const ProjectDepartmentGreens = lazy(() => import("../pages/ProjectDepartments/projectDepartmentGreens"));
// const ProjectDepartmentGreenscreens = lazy(() => import("../pages/ProjectDepartments/projectDepartmentGreenscreens"));
// const ProjectDepartmentGrip = lazy(() => import("../pages/ProjectDepartments/projectDepartmentGrip"));
// const ProjectDepartmentHairAndMakeup = lazy(() => import("../pages/ProjectDepartments/projectDepartmentHairAndMakeup"));
// const ProjectDepartmentHealthAndSafety = lazy(() => import("../pages/ProjectDepartments/projectDepartmentHealthAndSafety"));
// const ProjectDepartmentIt = lazy(() => import("../pages/ProjectDepartments/projectDepartmentIt"));
// const ProjectDepartmentLocations = lazy(() => import("../pages/ProjectDepartments/projectDepartmentLocations"));
// const ProjectDepartmentMarine = lazy(() => import("../pages/ProjectDepartments/projectDepartmentMarine"));
// const ProjectDepartmentMedical = lazy(() => import("../pages/ProjectDepartments/projectDepartmentMedical"));
// const ProjectDepartmentMilitary = lazy(() => import("../pages/ProjectDepartments/projectDepartmentMilitary"));
// const ProjectDepartmentMusic = lazy(() => import("../pages/ProjectDepartments/projectDepartmentMusic"));
// const ProjectDepartmentPhotography = lazy(() => import("../pages/ProjectDepartments/projectDepartmentPhotography"));
// const ProjectDepartmentPictureVehicles = lazy(() => import("../pages/ProjectDepartments/projectDepartmentPictureVehicles"));
// const ProjectDepartmentPostProduction = lazy(() => import("../pages/ProjectDepartments/projectDepartmentPostProduction"));
// const ProjectDepartmentProduction = lazy(() => import("../pages/ProjectDepartments/projectDepartmentProduction"));
// const ProjectDepartmentPropMaking = lazy(() => import("../pages/ProjectDepartments/projectDepartmentPropMaking"));
// const ProjectDepartmentProps = lazy(() => import("../pages/ProjectDepartments/projectDepartmentProps"));
// const ProjectDepartmentProsthetics = lazy(() => import("../pages/ProjectDepartments/projectDepartmentProsthetics"));
// const ProjectDepartmentPublicity = lazy(() => import("../pages/ProjectDepartments/projectDepartmentPublicity"));
// const ProjectDepartmentPuppeteer = lazy(() => import("../pages/ProjectDepartments/projectDepartmentPuppeteer"));
// const ProjectDepartmentRigging = lazy(() => import("../pages/ProjectDepartments/projectDepartmentRigging"));
// const ProjectDepartmentSfx = lazy(() => import("../pages/ProjectDepartments/projectDepartmentSfx"));
// const ProjectDepartmentScript = lazy(() => import("../pages/ProjectDepartments/projectDepartmentScript"));
// const ProjectDepartmentScriptEditing = lazy(() => import("../pages/ProjectDepartments/projectDepartmentScriptEditing"));
// const ProjectDepartmentSecurity = lazy(() => import("../pages/ProjectDepartments/projectDepartmentSecurity"));
// const ProjectDepartmentSetDec = lazy(() => import("../pages/ProjectDepartments/projectDepartmentSetDec"));
// const ProjectDepartmentSound = lazy(() => import("../pages/ProjectDepartments/projectDepartmentSound"));
// const ProjectDepartmentStandby = lazy(() => import("../pages/ProjectDepartments/projectDepartmentStandby"));
// const ProjectDepartmentStoryboard = lazy(() => import("../pages/ProjectDepartments/projectDepartmentStoryboard"));
// const ProjectDepartmentStudioUnit = lazy(() => import("../pages/ProjectDepartments/projectDepartmentStudioUnit"));
// const ProjectDepartmentStunts = lazy(() => import("../pages/ProjectDepartments/projectDepartmentStunts"));
// const ProjectDepartmentSupportingArtist = lazy(() => import("../pages/ProjectDepartments/projectDepartmentSupportingArtist"));
// const ProjectDepartmentSustainability = lazy(() => import("../pages/ProjectDepartments/projectDepartmentSustainability"));
// const ProjectDepartmentTransport = lazy(() => import("../pages/ProjectDepartments/projectDepartmentTransport"));
// const ProjectDepartmentTutors = lazy(() => import("../pages/ProjectDepartments/projectDepartmentTutors"));
// const ProjectDepartmentUnderwater = lazy(() => import("../pages/ProjectDepartments/projectDepartmentUnderwater"));
// const ProjectDepartmentVfx = lazy(() => import("../pages/ProjectDepartments/projectDepartmentVfx"));
// const ProjectDepartmentVideo = lazy(() => import("../pages/ProjectDepartments/projectDepartmentVideo"));
// const ProjectDepartmentVoice = lazy(() => import("../pages/ProjectDepartments/projectDepartmentVoice"));

const NotFound = lazy(() => import('@/shared/pages/NotFound'));

const ProjectDepartmentsRoutes = {
    path: "departments",
    element: <ProjectDepartments />,
    children: [
        // { path: "accounts", element: <ProjectDepartmentAccounts /> },
        // { path: "action-vehicles", element: <ProjectDepartmentActionVehicles /> },
        // { path: "aerial", element: <ProjectDepartmentAerial /> },
        // { path: "animals", element: <ProjectDepartmentAnimals /> },
        // { path: "animation", element: <ProjectDepartmentAnimation /> },
        // { path: "armoury", element: <ProjectDepartmentArmoury /> },
        // { path: "art", element: <ProjectDepartmentArt /> },
        // { path: "assets", element: <ProjectDepartmentAssets /> },
        // { path: "assistant-directors", element: <ProjectDepartmentAssistantDirectors /> },
        // { path: "camera", element: <ProjectDepartmentCamera /> },
        // { path: "cast", element: <ProjectDepartmentCast /> },
        // { path: "chaperones", element: <ProjectDepartmentChaperones /> },
        // { path: "choreography", element: <ProjectDepartmentChoreography /> },
        // { path: "clearances", element: <ProjectDepartmentClearances /> },
        // { path: "computer-graphics", element: <ProjectDepartmentComputerGraphics /> },
        // { path: "construction", element: <ProjectDepartmentConstruction /> },
        // { path: "continuity", element: <ProjectDepartmentContinuity /> },
        // { path: "costume", element: <ProjectDepartmentCostume /> },
        // { path: "costume-fx", element: <ProjectDepartmentCostumeFx /> },
        // { path: "covid-safety", element: <ProjectDepartmentCovidSafety /> },
        // { path: "creature-effects", element: <ProjectDepartmentCreatureEffects /> },
        // { path: "dit", element: <ProjectDepartmentDit /> },
        // { path: "digital-assets", element: <ProjectDepartmentDigitalAssets /> },
        // { path: "digital-playback", element: <ProjectDepartmentDigitalPlayback /> },
        // { path: "director", element: <ProjectDepartmentDirector /> },
        // { path: "documentary", element: <ProjectDepartmentDocumentary /> },
        // { path: "drapes", element: <ProjectDepartmentDrapes /> },
        // { path: "epk", element: <ProjectDepartmentEpk /> },
        // { path: "editorial", element: <ProjectDepartmentEditorial /> },
        // { path: "electrical", element: <ProjectDepartmentElectrical /> },
        // { path: "electrical-rigging", element: <ProjectDepartmentElectricalRigging /> },
        // { path: "franchise", element: <ProjectDepartmentFranchise /> },
        // { path: "greens", element: <ProjectDepartmentGreens /> },
        // { path: "greenscreens", element: <ProjectDepartmentGreenscreens /> },
        // { path: "grip", element: <ProjectDepartmentGrip /> },
        // { path: "hair-and-makeup", element: <ProjectDepartmentHairAndMakeup /> },
        // { path: "health-and-safety", element: <ProjectDepartmentHealthAndSafety /> },
        // { path: "it", element: <ProjectDepartmentIt /> },
        // { path: "locations", element: <ProjectDepartmentLocations /> },
        // { path: "marine", element: <ProjectDepartmentMarine /> },
        // { path: "medical", element: <ProjectDepartmentMedical /> },
        // { path: "military", element: <ProjectDepartmentMilitary /> },
        // { path: "music", element: <ProjectDepartmentMusic /> },
        // { path: "photography", element: <ProjectDepartmentPhotography /> },
        // { path: "picture-vehicles", element: <ProjectDepartmentPictureVehicles /> },
        // { path: "post-production", element: <ProjectDepartmentPostProduction /> },
        // { path: "production", element: <ProjectDepartmentProduction /> },
        // { path: "prop-making", element: <ProjectDepartmentPropMaking /> },
        // { path: "props", element: <ProjectDepartmentProps /> },
        // { path: "prosthetics", element: <ProjectDepartmentProsthetics /> },
        // { path: "publicity", element: <ProjectDepartmentPublicity /> },
        // { path: "puppeteer", element: <ProjectDepartmentPuppeteer /> },
        // { path: "rigging", element: <ProjectDepartmentRigging /> },
        // { path: "sfx", element: <ProjectDepartmentSfx /> },
        // { path: "script", element: <ProjectDepartmentScript /> },
        // { path: "script-editing", element: <ProjectDepartmentScriptEditing /> },
        // { path: "security", element: <ProjectDepartmentSecurity /> },
        // { path: "set-dec", element: <ProjectDepartmentSetDec /> },
        // { path: "sound", element: <ProjectDepartmentSound /> },
        // { path: "standby", element: <ProjectDepartmentStandby /> },
        // { path: "storyboard", element: <ProjectDepartmentStoryboard /> },
        // { path: "studio-unit", element: <ProjectDepartmentStudioUnit /> },
        // { path: "stunts", element: <ProjectDepartmentStunts /> },
        // { path: "supporting-artist", element: <ProjectDepartmentSupportingArtist /> },
        // { path: "sustainability", element: <ProjectDepartmentSustainability /> },
        // { path: "transport", element: <ProjectDepartmentTransport /> },
        // { path: "tutors", element: <ProjectDepartmentTutors /> },
        // { path: "underwater", element: <ProjectDepartmentUnderwater /> },
        // { path: "vfx", element: <ProjectDepartmentVfx /> },
        // { path: "video", element: <ProjectDepartmentVideo /> },
        // { path: "voice", element: <ProjectDepartmentVoice /> },

        { path: "*", element: <NotFound /> },
    ],
};

export default ProjectDepartmentsRoutes;



