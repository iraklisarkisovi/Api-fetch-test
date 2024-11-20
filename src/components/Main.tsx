import { Box, Button, Typography, Modal } from '@mui/material';
import React, { useEffect, useState } from 'react';

interface BpiData {
  code: string;
  rate: string;
  description: string;
}

interface TimeData {
  updated: string;
}

const Main: React.FC = () => {
  const [bpiData, setBpiData] = useState<BpiData[] | null>(null)
  const [timeData, setTimeData] = useState<TimeData | null>(null);
  const [switchh, setSwitchh] = useState(false);
  const [selectedRate, setSelectedRate] = useState<string | null>(null)

  const Switcher = (rate: string) => {
    setSelectedRate(rate);  
    setSwitchh(!switchh);  
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('https://api.coindesk.com/v1/bpi/currentprice.json')
        if (!res.ok) {
          throw new Error('Failed to fetch');
        }
        const result = await res.json();


        const bpi: BpiData[] = Object.values(result.bpi).map((item: any) => ({
          code: item.code,
          rate: item.rate,
          description: item.description || 'No description available',
        }));

        setBpiData(bpi);

        const time: TimeData = { updated: result.time.updated };
        setTimeData(time);
      } catch (err) {
        console.error('Error fetching data:', err)
      }
    }

    fetchData();
  }, []);

  return (
    <Box>
      {timeData ? (
        <Typography variant="h6" gutterBottom>
          Last Updated: {timeData.updated}
        </Typography>
      ) : (
        <Typography>Loading time data...</Typography>
      )}
      <Typography variant='h3'  textAlign={'center'}>BitCoin Rate</Typography>
      {bpiData ? (
        <Box
          mb={2}
          display="flex"
          alignItems="center"
          justifyContent="space-around"
          flexWrap="wrap"
          padding="10px"
          gap="16px"
        >
          {bpiData.map((item) => (
            
            <Box
              key={item.code}
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              padding="10px"
              bgcolor="lightgray"
              borderRadius="8px"
              boxShadow="0 2px 4px rgba(0, 0, 0, 0.1)"
              minWidth="120px"
              textAlign="center"
            >
              <Typography variant="body1" mb={1}>
                {item.code} - {item.description}
              </Typography>
              <Button variant="contained" color="primary" onClick={() => Switcher(item.rate)}>
                Show Rate
              </Button>
            </Box>
          ))}
        </Box>
      ) : (
        <Typography>Loading currency data...</Typography>
      )}

      <Modal
        open={switchh}
        onClose={() => setSwitchh(false)}
        aria-labelledby="rate-modal-title"
        aria-describedby="rate-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'white',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            textAlign: 'center',
            minWidth: '300px',
          }}
        >
          <Typography id="rate-modal-title" variant="h6">
            Selected Rate
          </Typography>
          <Typography id="rate-modal-description" variant="body1" mt={2}>
            {selectedRate}
          </Typography>
          <Button onClick={() => setSwitchh(false)} sx={{ mt: 2 }}>
            Close
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default Main;
