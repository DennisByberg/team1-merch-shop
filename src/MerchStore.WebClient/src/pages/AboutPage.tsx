import { Box, Typography, Paper, Alert, AlertTitle, Button } from '@mui/material';
import { Cloud, GitHub } from '@mui/icons-material';
import PageBreadcrumbs from '../components/PageBreadcrumbs';

function AboutPage() {
  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <PageBreadcrumbs />

      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 5 }}>
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          🛍️ EchoStore
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ mb: 2 }}>
          A modern e-commerce platform built as a collaborative project at Campus Mölndal
        </Typography>
        <Typography variant="body1" sx={{ maxWidth: 800, mx: 'auto' }}>
          EchoStore is a full-stack web application demonstrating enterprise-level
          software development practices. Built with Clean Architecture principles, the
          platform features a React TypeScript frontend, ASP.NET Core Web API backend, and
          cloud-native deployment on Azure.
        </Typography>
      </Box>

      {/* Loading Time Explanation */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Alert severity="info" sx={{ mb: 3 }}>
          <AlertTitle>Why does the loading take so long? 🤔</AlertTitle>
          <Typography variant="body2" sx={{ mt: 1 }}>
            If you experienced long loading times when first visiting EchoStore, here's
            why:
          </Typography>
        </Alert>

        <Typography
          variant="h6"
          gutterBottom
          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <Cloud color="primary" />
          Container Warm-up Process
        </Typography>

        <Typography variant="body1" paragraph>
          Our application runs on <strong>Azure Container Apps</strong> using student-tier
          resources. When containers haven't been used for a while, they go into a "cold
          start" state to save resources. This means:
        </Typography>

        <Box component="ul" sx={{ pl: 3, mb: 2 }}>
          <li>
            <Typography variant="body2">
              Backend API container needs time to start up
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              External review API container also needs warm-up
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              Database connections need to be established
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              All services need to synchronize before responding
            </Typography>
          </li>
        </Box>

        <Typography variant="body2" color="text.secondary">
          This is a common characteristic of cost-effective cloud hosting solutions. In
          production environments, containers would typically use "always-on" scaling to
          avoid this delay.
        </Typography>
      </Paper>

      {/* Learn More Section */}
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}
        >
          <GitHub color="primary" />
          Want to learn more?
        </Typography>
        <Typography variant="body1" paragraph>
          Explore our complete project documentation, architecture details, and
          development process on GitHub.
        </Typography>
        <Button
          variant="contained"
          startIcon={<GitHub />}
          href="https://github.com/DennisByberg/team1-merch-shop"
          target="_blank"
          rel="noopener noreferrer"
          sx={{ mt: 2 }}
        >
          View on GitHub
        </Button>
      </Paper>
    </Box>
  );
}

export default AboutPage;
