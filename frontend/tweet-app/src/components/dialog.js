import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import {useAlert} from 'react-alert';
import './dialog.css';
import TweetBox from './tweetbox/TweetBox';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

export default function CustomizedDialogs({id}) {
  const [open, setOpen] = React.useState(false);

  const alert = useAlert();


  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    alert.success("You close the box");
    setOpen(false);
  };

  return (
    <div>
      <Button className="tweet__replyButton" onClick={handleClickOpen}>
      <ChatBubbleOutlineIcon fontSize="small"/>
      </Button>
      <BootstrapDialog
        onClose={handleClose}
        className="dialog__box"
        BackdropProps={{style:{backgroundColor: "transparent"}}}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
          Reply Tweet
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <TweetBox tweetId={id}/>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
}
