import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/admin/AdminLogin';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/admin/AdminLayout';
import ErrorBoundary from './components/ErrorBoundary';
import { SectionConfigProvider } from './contexts/SectionConfigContext';

// Admin Section Components
import AdminHero from './components/admin/AdminHero';
import AdminAbout from './components/admin/AdminAbout';
import AdminExperiences from './components/admin/AdminExperiences';
import AdminStats from './components/admin/AdminStats';
import AdminTestimonials from './components/admin/AdminTestimonials';
import AdminContact from './components/admin/AdminContact';
import AdminAwards from './components/admin/AdminAwards';
import AdminEducation from './components/admin/AdminEducation';
import AdminCertifications from './components/admin/AdminCertifications';
import AdminSkills from './components/admin/AdminSkills';
import AdminSectionConfig from './components/admin/AdminSectionConfig';
import AdminProjects from './components/admin/AdminProjects';
import AdminEnquiries from './components/admin/AdminEnquiries';
import AdminBlogs from './components/admin/AdminBlogs';

// Main Site Components
import HeroSection from './sections/HeroSection';
import NewAboutSection from './sections/NewAboutSection';
import ExperienceSection from './sections/ExperienceSection';
import StatsSection from './sections/StatsSection';
import TestimonialsSection from './sections/TestimonialsSection';
import ContactSection from './sections/ContactSection';
import ThankYouSection from './sections/ThankYouSection';
import ProjectsSection from './sections/ProjectsSection';
import BlogsSection from './sections/BlogsSection';

// Wrapper component for individual admin sections to provide a consistent layout
const AdminSectionPage = ({ title, component }) => {
  const Component = component;
  return (
    <ProtectedRoute>
      <AdminLayout title={title}>
        <Component />
      </AdminLayout>
    </ProtectedRoute>
  );
};

// Wrapper component for the main public-facing site
const MainSite = () => {
  console.log('MainSite component rendering...');
  
  return (
    <>
      <HeroSection />
      <NewAboutSection />
      <ExperienceSection />
      <ProjectsSection />
      <BlogsSection />
      <StatsSection />
      <TestimonialsSection />
      <ContactSection />
      <ThankYouSection />
    </>
  );
};

function App() {
  console.log('App component rendering...');
  
  return (
    <ErrorBoundary>
      <SectionConfigProvider>
        <div className="App">
          <Routes>
            <Route path="/" element={<MainSite />} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route 
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Individual Admin Section Routes */}
            <Route path="/admin/hero" element={<AdminSectionPage title="Hero Section" component={AdminHero} />} />
            <Route path="/admin/about" element={<AdminSectionPage title="About Section" component={AdminAbout} />} />
            <Route path="/admin/experiences" element={<AdminSectionPage title="Experiences" component={AdminExperiences} />} />
            <Route path="/admin/stats" element={<AdminSectionPage title="Statistics" component={AdminStats} />} />
            <Route path="/admin/testimonials" element={<AdminSectionPage title="Testimonials" component={AdminTestimonials} />} />
            <Route path="/admin/contact" element={<AdminSectionPage title="Contact Info" component={AdminContact} />} />
            <Route path="/admin/awards" element={<AdminSectionPage title="Awards" component={AdminAwards} />} />
            <Route path="/admin/education" element={<AdminSectionPage title="Education" component={AdminEducation} />} />
            <Route path="/admin/certifications" element={<AdminSectionPage title="Certifications" component={AdminCertifications} />} />
            <Route path="/admin/skills" element={<AdminSectionPage title="Skills" component={AdminSkills} />} />
            <Route path="/admin/config" element={<AdminSectionPage title="Section Titles" component={AdminSectionConfig} />} />
            <Route path="/admin/projects" element={<AdminSectionPage title="Projects" component={AdminProjects} />} />
            <Route path="/admin/enquiries" element={<AdminSectionPage title="Contact Enquiries" component={AdminEnquiries} />} />
            <Route path="/admin/blogs" element={<AdminSectionPage title="Blogs" component={AdminBlogs} />} />

          </Routes>
        </div>
      </SectionConfigProvider>
    </ErrorBoundary>
  );
}

export default App;
