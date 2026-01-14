import { lazy } from "react";

// Layouts
const TimesheetSettingsLayout = lazy(() =>
    import("../timesheets/layouts/TimesheetSettingsLayout")
);
const TimesheetSettingsTabsLayout = lazy(() =>
    import("../timesheets/layouts/TimesheetSettingsTabsLayout")
);
const OnboardingSettingsLayout = lazy(() =>
    import("../timesheets/layouts/OnboardingSettingsLayout")
);
const ProjectDetailsSettingsLayout = lazy(() =>
    import("../timesheets/layouts/ProjectDetailsSettingsLayout")
);

const TimesheetGeneralSettings = lazy(() =>
    import("../timesheets/pages/timesheet-settings/TimesheetGeneralSettings")
);
const NotificationSettings = lazy(() =>
    import("../timesheets/pages/timesheet-settings/NotificationSettings")
);
const CustomSettings = lazy(() =>
    import("../timesheets/pages/timesheet-settings/CustomSettings")
);
const PennyContractSettings = lazy(() =>
    import("../timesheets/pages/timesheet-settings/PennyContractSettings")
);
const PactCalculatorSettings = lazy(() =>
    import("../timesheets/pages/timesheet-settings/PactCalculatorSettings")
);
const ContractComparisonSettings = lazy(() =>
    import("../timesheets/pages/timesheet-settings/ContractComparisonSettings")
);
const TimesheetAiAutomationSettings = lazy(() =>
    import("../timesheets/pages/timesheet-settings/TimesheetAiAutomationSettings")
);

// const StandardCrewSettings = lazy(() =>
//   import("../timesheets/pages/timesheet-settings/onboarding/StandardCrewSettings")
// );
// const ConstructionSettings = lazy(() =>
//   import("../timesheets/pages/timesheet-settings/onboarding/ConstructionSettings")
// );
// const SignersAndRecipientsSettings = lazy(() =>
//   import("../timesheets/pages/timesheet-settings/onboarding/SignersAndRecipientsSettings")
// );
// const TemplatesSettings = lazy(() =>
//   import("../timesheets/pages/timesheet-settings/onboarding/TemplatesSettings")
// );
// const AdminSettings = lazy(() =>
//   import("../timesheets/pages/timesheet-settings/onboarding/AdminSettings")
// );

// const DetailsSettings = lazy(() =>
//   import("../timesheets/pages/timesheet-settings/project-details/DetailsSettings")
// );
// const ContactSettings = lazy(() =>
//   import("../timesheets/pages/timesheet-settings/project-details/ContactSettings")
// );
// const DatesSettings = lazy(() =>
//   import("../timesheets/pages/timesheet-settings/project-details/DatesSettings")
// );
// const PlacesSettings = lazy(() =>
//   import("../timesheets/pages/timesheet-settings/project-details/PlacesSettings")
// );
// const DepartmentsSettings = lazy(() =>
//   import("../timesheets/pages/timesheet-settings/project-details/DepartmentsSettings")
// );
// const ProjectGeneralSettings = lazy(() =>
//   import("../timesheets/pages/timesheet-settings/project-details/ProjectGeneralSettings")
// );

const NotFound = lazy(() => import("@/shared/pages/NotFound"));

const TimesheetSettingsRoutes = {
    path: "settings",
    element: <TimesheetSettingsLayout />,
    children: [
        {
            element: <TimesheetSettingsTabsLayout  />,
            children: [
                { index: true, element: <TimesheetGeneralSettings /> },
                { path: "notifications", element: <NotificationSettings /> },
                { path: "custom", element: <CustomSettings /> },
                { path: "penny-contracts", element: <PennyContractSettings /> },
                { path: "pact-calculator", element: <PactCalculatorSettings /> },
                { path: "contract-comparison", element: <ContractComparisonSettings /> },
                { path: "ai-automation", element: <TimesheetAiAutomationSettings /> },
            ],
        },



        // {
        //   path: "onboarding",
        //   element: <OnboardingSettingsLayout />,
        //   children: [
        //     { index: true, element: <StandardCrewSettings /> },
        //     { path: "construction", element: <ConstructionSettings /> },
        //     { path: "signers-recipients", element: <SignersAndRecipientsSettings /> },
        //     { path: "templates", element: <TemplatesSettings /> },
        //     { path: "admin", element: <AdminSettings /> },
        //   ],
        // },

        // {
        //   path: "project-details",
        //   element: <ProjectDetailsSettingsLayout />,
        //   children: [
        //     { index: true, element: <DetailsSettings /> },
        //     { path: "contacts", element: <ContactSettings /> },
        //     { path: "dates", element: <DatesSettings /> },
        //     { path: "places", element: <PlacesSettings /> },
        //     { path: "departments", element: <DepartmentsSettings /> },
        //     { path: "project", element: <ProjectGeneralSettings /> },
        //   ],
        // },

        { path: "*", element: <NotFound /> },
    ],
};

export default TimesheetSettingsRoutes;











