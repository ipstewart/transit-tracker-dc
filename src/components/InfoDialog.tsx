import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';

interface InfoDialogProps {
  open: boolean;
  onClose: () => void;
}

function InfoDialog({ open, onClose }: Readonly<InfoDialogProps>) {
  return (
    <Dialog onClose={() => onClose()} open={open} PaperProps={{ sx: { borderRadius: '2px' } }}>
      <DialogTitle fontWeight="700">Transit Tracker DC</DialogTitle>
      <DialogContent>
        <Typography variant="body1" mb={2}>
          Transit Tracker DC helps you navigate the Washington Metropolitan Area Transit Authority
          (WMATA) system with real-time bus and metro schedule updates. Enter an address or use your
          current location to find nearby transit options, then use our three tabs to get the info you
          need.
        </Typography>

        <Typography variant="body1" fontWeight="700">
          Bus Tab
        </Typography>
        <Typography variant="body1" mb={2}>
          View all bus stops within a 1-mile radius, and click on any stop to get real-time
          schedules and route details for each bus serving that stop.
        </Typography>

        <Typography variant="body1" fontWeight="700">
          Metro Tab
        </Typography>
        <Typography variant="body1" mb={2}>
          Find nearby metro stations and click on them to see real-time schedules for each metro
          line.
        </Typography>

        <Typography variant="body1" fontWeight="700">
          Map Tab
        </Typography>
        <Typography variant="body1" mb={2}>
          See a map of nearby bus stops and metro stations and click on them to get more
          information.
        </Typography>

        <Typography variant="body1">
          Transit Tracker DC is completely ad-free. With reliable transit info at your fingertips,
          you can plan your commute or explore D.C. without hassle.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose()}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

export default InfoDialog;
