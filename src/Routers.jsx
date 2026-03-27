import React, { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import PrivateRoute from './components/PrivateRoute';
import LandingLayout from './components/Landing/LandingLayout';

// Lazy-loaded pages
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Login = lazy(() => import('./pages/Login'));
const NotFound = lazy(() => import('./pages/NotFound'));
const FarmList = lazy(() => import('./pages/Farm/FarmList'));
const FarmDetail = lazy(() => import('./pages/Farm/FarmDetail'));
const PlotList = lazy(() => import('./pages/Plot/PlotList'));
const PlotDetail = lazy(() => import('./pages/Plot/PlotDetail'));
const CropCycleList = lazy(() => import('./pages/CropCycle/CropCycleList'));
const CropCycleDetail = lazy(() => import('./pages/CropCycle/CropCycleDetail'));
const TaskPlanList = lazy(() => import('./pages/TaskPlan/TaskPlanList'));
const TaskLogList = lazy(() => import('./pages/TaskLog/TaskLogList'));
const TaskLogForm = lazy(() => import('./pages/TaskLog/TaskLogForm'));
const InputItemList = lazy(() => import('./pages/InputItem/InputItemList'));
const ResourceList = lazy(() => import('./pages/Resource/ResourceList'));
const PestIncidentList = lazy(() => import('./pages/PestIncident/PestIncidentList'));
const HarvestList = lazy(() => import('./pages/Harvest/HarvestList'));
const QRTrace = lazy(() => import('./pages/QRTrace/QRTrace'));
const QRScanPage = lazy(() => import('./pages/QRTrace/QRScanPage'));
const ReportPage = lazy(() => import('./pages/Report/ReportPage'));
const AdminUsers = lazy(() => import('./pages/Admin/AdminUsers'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const PermissionMatrix = lazy(() => import('./pages/Admin/PermissionMatrix'));
const AuditLog = lazy(() => import('./pages/Admin/AuditLog'));
const Profile = lazy(() => import('./pages/Profile'));
const Settings = lazy(() => import('./pages/Settings'));
const Notifications = lazy(() => import('./pages/Notifications'));
const CooperativeList = lazy(() => import('./pages/Cooperative/CooperativeList'));
const LotManagement = lazy(() => import('./pages/Lot/LotManagement'));
const CalendarView = lazy(() => import('./pages/Calendar/CalendarView'));
const WorkerStats = lazy(() => import('./pages/Worker/WorkerStats'));
const Warehouse = lazy(() => import('./pages/Warehouse/Warehouse'));
const ChangePassword = lazy(() => import('./pages/ChangePassword/ChangePassword'));
const HelpPage = lazy(() => import('./pages/Help/HelpPage'));

// Landing Pages
const HomePage = lazy(() => import('./pages/Landing/HomePage/HomePage'));
const AboutPage = lazy(() => import('./pages/Landing/AboutPage/AboutPage'));
const PricingPage = lazy(() => import('./pages/Landing/PricingPage/PricingPage'));

const LoadingFallback = () => (
    <div className="loading-fallback">
        <div className="loading-spinner" />
    </div>
);

function Routers() {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/qr/:lotCode" element={<QRTrace />} />

                {/* Landing Pages (Public) */}
                <Route
                    path="/home"
                    element={
                        <LandingLayout>
                            <HomePage />
                        </LandingLayout>
                    }
                />
                <Route
                    path="/about"
                    element={
                        <LandingLayout>
                            <AboutPage />
                        </LandingLayout>
                    }
                />
                <Route
                    path="/pricing"
                    element={
                        <LandingLayout>
                            <PricingPage />
                        </LandingLayout>
                    }
                />

                {/* Protected Routes with Layout */}
                <Route
                    path="/*"
                    element={
                        <PrivateRoute>
                            <MainLayout>
                                <Suspense fallback={<LoadingFallback />}>
                                    <Routes>
                                        <Route path="/" element={<Dashboard />} />
                                        {/* Farm & Plot */}
                                        <Route path="/farms" element={<FarmList />} />
                                        <Route path="/farms/:id" element={<FarmDetail />} />
                                        <Route path="/plots" element={<PlotList />} />
                                        <Route path="/plots/:id" element={<PlotDetail />} />
                                        {/* Crop Cycles */}
                                        <Route path="/crop-cycles" element={<CropCycleList />} />
                                        <Route path="/crop-cycles/:id" element={<CropCycleDetail />} />
                                        {/* Task Plans & Logs */}
                                        <Route path="/task-plans" element={<TaskPlanList />} />
                                        <Route path="/task-logs" element={<TaskLogList />} />
                                        <Route path="/task-logs/new" element={<TaskLogForm />} />
                                        <Route path="/task-logs/:id/edit" element={<TaskLogForm />} />
                                        <Route path="/calendar" element={<CalendarView />} />
                                        {/* Categories */}
                                        <Route path="/input-items" element={<InputItemList />} />
                                        <Route path="/resources" element={<ResourceList />} />
                                        <Route path="/warehouse" element={<Warehouse />} />
                                        <Route path="/worker-stats" element={<WorkerStats />} />
                                        {/* Production */}
                                        <Route path="/pest-incidents" element={<PestIncidentList />} />
                                        <Route path="/harvests" element={<HarvestList />} />
                                        <Route path="/lots" element={<LotManagement />} />
                                        <Route path="/qr" element={<QRScanPage />} />
                                        {/* Reports & Admin */}
                                        <Route path="/reports" element={<ReportPage />} />
                                        <Route path="/cooperatives" element={<CooperativeList />} />
                                        <Route path="/admin/users" element={<AdminUsers />} />
                                        <Route path="/admin/permissions" element={<PermissionMatrix />} />
                                        <Route path="/admin/audit-log" element={<AuditLog />} />
                                        <Route path="/admin/dashboard" element={<AdminDashboard />} />
                                        {/* User */}
                                        <Route path="/profile" element={<Profile />} />
                                        <Route path="/settings" element={<Settings />} />
                                        <Route path="/notifications" element={<Notifications />} />
                                        <Route path="/change-password" element={<ChangePassword />} />
                                        <Route path="/help" element={<HelpPage />} />
                                        {/* 404 catch-all */}
                                        <Route path="*" element={<NotFound />} />
                                    </Routes>
                                </Suspense>
                            </MainLayout>
                        </PrivateRoute>
                    }
                />
            </Routes>
        </Suspense>
    );
}

export default Routers;
