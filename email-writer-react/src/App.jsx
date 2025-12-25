import { useState } from 'react';
import { Box, TextField, Typography, Container, FormControl, InputLabel, Select, MenuItem, Button, CircularProgress } from '@mui/material';
import './App.css';
import axios from 'axios';

function App() {
  const [emailContent, setEmailContent] = useState('');
  const [tone, setTone] = useState('');
  const [generatedReply, setGeneratedReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const localBaseUrl = import.meta.env.VITE_API_BASE_URL_LOCAL;
    
    try {
      //const response = await axios.post("http://localhost:8080/api/email/generate", {
      //const response = await axios.post(`${localBaseUrl}/api/email/generate`, {
      const response = await axios.post(`${baseUrl}/api/email/generate`, {
        emailContent,
        tone
      });
      setGeneratedReply(typeof response.data == 'string' ? response.data : JSON.stringify(response.data));
    } catch (error) {
      setError('Failed to generate email reply. Please try again');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
      <div className="main-container">
        <Typography variant='h4' component="h1" gutterBottom align="center" sx={{ mb: 3, fontWeight: 'bold' }}>
          Email Reply Generator
        </Typography>

        <TextField 
          fullWidth
          multiline
          rows={5}
          variant='outlined'
          label="Original Email Content"
          value={emailContent || ''}
          onChange={(e) => setEmailContent(e.target.value)}
          sx={{ mb: 2 }}
        />

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Tone (Optional)</InputLabel>
          <Select 
            value={tone || ''}
            label={"Tone (Optional)"}
            onChange={(e) => setTone(e.target.value)}
          >
            <MenuItem value="">None</MenuItem> 
            <MenuItem value="professional">Professional</MenuItem> 
            <MenuItem value="casual">Casual</MenuItem> 
            <MenuItem value="friendly">Friendly</MenuItem> 
          </Select>
        </FormControl>

        <Button
          variant='contained'
          onClick={handleSubmit}
          disabled={!emailContent || loading}
          fullWidth
          sx={{
          py: 1.5,
          fontSize: '1rem',
          backgroundColor: '#2d98fcfb',
          color: '#000000ff',
          '&:hover': {
            backgroundColor: '#2d98fcfb',
          },
        }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Generate Reply"}
        </Button>

        {error && (
          <Typography color='error' sx={{ mt: 2, textAlign: 'center' }}>
            {error}
          </Typography>
        )}

        {generatedReply && (
          <Box sx={{ mt: 4 }}>
            <Typography variant='h6' gutterBottom>
              Generated Reply:
            </Typography>
            <TextField 
              fullWidth
              multiline
              rows={6}
              variant='outlined'
              value={generatedReply || ''}
              InputProps={{
                readOnly: true,
              }}
              sx={{
                backgroundColor: '#f5f5f5',
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#e0e0e0',
                  },
                  '&:hover fieldset': {
                    borderColor: '#c0c0c0',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#1976d2',
                  },
                },
              }}
            />
            <Button 
              variant='outlined'
              sx={{ mt: 2 }}
              onClick={() => navigator.clipboard.writeText(generatedReply)}
            >
              Copy to Clipboard
            </Button>
          </Box>
        )}
      </div>
  )
}

export default App
