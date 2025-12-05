import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import { JitsiMeeting } from '@jitsi/react-sdk';
import { 
  Box, 
  Button, 
  Container, 
  Typography, 
  Paper, 
  TextField, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Badge,
  Avatar,
  Chip,
  Grid,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Mic as MicIcon,
  MicOff as MicOffIcon,
  Videocam as VideocamIcon,
  VideocamOff as VideocamOffIcon,
  ScreenShare as ScreenShareIcon,
  StopScreenShare as StopScreenShareIcon,
  MoreVert as MoreVertIcon,
  People as PeopleIcon,
  Chat as ChatIcon,
  Close as CloseIcon,
  ExitToApp as LeaveIcon,
  RecordVoiceOver as RecordIcon,
  ClosedCaption as CaptionIcon,
  Settings as SettingsIcon,
  Info as InfoIcon,
  Link as LinkIcon,
  PersonAdd as PersonAddIcon,
  MoreHoriz as MoreHorizIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Fullscreen as FullscreenIcon,
  FullscreenExit as FullscreenExitIcon,
  PresentToAll as PresentToAllIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { meetingService } from '../services/meeting.service';
import { useTranslation } from 'react-i18next';

// Styled components
const MeetingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  backgroundColor: theme.palette.background.default,
  overflow: 'hidden',
}));

const MainContent = styled(Box)({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  overflow: 'hidden',
});

const VideoContainer = styled(Box)({
  flex: 1,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#202124',
  position: 'relative',
  overflow: 'hidden',
});

const ControlsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(1, 2),
  backgroundColor: theme.palette.background.paper,
  borderTop: `1px solid ${theme.palette.divider}`,
  height: '72px',
}));

const ControlButton = styled(IconButton)(({ theme, active }) => ({
  margin: theme.spacing(0, 1),
  backgroundColor: active ? theme.palette.grey[300] : theme.palette.grey[200],
  '&:hover': {
    backgroundColor: theme.palette.grey[300],
  },
  width: '48px',
  height: '48px',
}));

const EndCallButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.error.main,
  color: theme.palette.error.contrastText,
  '&:hover': {
    backgroundColor: theme.palette.error.dark,
  },
  marginLeft: theme.spacing(2),
  padding: theme.spacing(1, 3),
  borderRadius: '24px',
  textTransform: 'none',
  fontWeight: 'bold',
}));

const ParticipantAvatar = styled(Avatar)(({ theme }) => ({
  width: 40,
  height: 40,
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
}));

const Meeting = () => {
  const { roomName } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // State
  const [meeting, setMeeting] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [isHost, setIsHost] = useState(false);
  const [meetingTitle, setMeetingTitle] = useState('Meeting');
  const [meetingLink, setMeetingLink] = useState('');
  const [showMeetingInfo, setShowMeetingInfo] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isCaptionOn, setIsCaptionOn] = useState(false);
  const [isRaiseHand, setIsRaiseHand] = useState(false);
  
  // Refs
  const jitsiContainerRef = useRef(null);
  const jitsiRef = useRef(null);
  const apiRef = useRef(null);
  
  // Fetch meeting details
  useEffect(() => {
    const fetchMeeting = async () => {
      try {
        setIsLoading(true);
        const response = await meetingService.getMeeting(roomName);
        setMeeting(response.data);
        setMeetingTitle(response.data.title || 'Meeting');
        setMeetingLink(window.location.href);
        setIsHost(response.data.createdBy === user._id);
        
        // Set up participant list
        if (response.data.participants) {
          setParticipants(response.data.participants);
        }
        
        // Join the meeting
        await joinMeeting();
      } catch (err) {
        console.error('Error fetching meeting:', err);
        setError('Failed to load meeting. Please try again.');
        toast.error('Failed to load meeting');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (roomName && user) {
      fetchMeeting();
    }
    
    return () => {
      // Clean up Jitsi instance on unmount
      if (jitsiRef.current) {
        jitsiRef.current.dispose();
      }
    };
  }, [roomName, user]);
  
  // Join meeting with Jitsi
  const joinMeeting = async () => {
    try {
      // Generate or get JWT token
      const token = await meetingService.getMeetingToken(roomName);
      
      // Initialize JitsiMeetExternalAPI
      const jitsiOptions = {
        roomName: roomName,
        width: '100%',
        height: '100%',
        parentNode: jitsiContainerRef.current,
        userInfo: {
          displayName: user.name || user.email.split('@')[0],
          email: user.email,
          avatar: user.avatar
        },
        configOverwrite: {
          startWithAudioMuted: isMuted,
          startWithVideoMuted: !isVideoOn,
          enableWelcomePage: false,
          enableClosePage: false,
          disableDeepLinking: true,
          disableInviteFunctions: true,
          enableNoAudioDetection: true,
          enableNoisyMicDetection: true,
          enableAutomaticUrlCopy: true,
          enableLobbyChat: true,
          enableInsecureRoomNameWarning: false,
          disableRemoteMute: !isHost,
          disableRemoteControlFocus: !isHost,
          disableRemoteVideoMenu: !isHost,
          disableProfile: !isHost,
          toolbarButtons: [
            'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
            'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
            'livestreaming', 'etherpad', 'sharedvideo', 'shareaudio', 'tileview',
            'videoquality', 'filmstrip', 'invite', 'feedback', 'stats', 'shortcuts',
            'tileview'
          ]
        },
        interfaceConfigOverwrite: {
          APP_NAME: 'Equity Leaders Meet',
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          DEFAULT_BACKGROUND: '#202124',
          DEFAULT_REMOTE_DISPLAY_NAME: 'Guest',
          DEFAULT_LOCAL_DISPLAY_NAME: 'Me',
          SHOW_PROMOTIONAL_CLOSE_PAGE: false,
          DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
          FILM_STRIP_ONLY: false,
          TILE_VIEW_MAX_COLUMNS: 5,
          MOBILE_APP_PROMO: false,
          MAXIMUM_ZOOMING_COEFFICIENT: 1.3,
          ENABLE_DIAL_OUT: false,
          ENABLE_DIAL_IN: false,
          CLOSE_PAGE_GUEST_HINT: false,
        },
        jwt: token,
        onload: 'ui',
      };
      
      // Initialize Jitsi
      const jitsi = new JitsiMeetExternalAPI(process.env.REACT_APP_JITSI_DOMAIN || 'meet.jit.si', jitsiOptions);
      jitsiRef.current = jitsi;
      
      // Event listeners
      jitsi.addListener('videoConferenceJoined', (data) => {
        console.log('Video conference joined', data);
        apiRef.current = jitsi;
        
        // Set display name
        jitsi.executeCommand('displayName', user.name || user.email.split('@')[0]);
        
        // Set avatar URL if available
        if (user.avatar) {
          jitsi.executeCommand('avatarUrl', user.avatar);
        }
        
        // Mute/unmute based on state
        if (isMuted) {
          jitsi.executeCommand('toggleAudio');
        }
        
        // Turn on/off video based on state
        if (!isVideoOn) {
          jitsi.executeCommand('toggleVideo');
        }
      });
      
      jitsi.addListener('participantRoleChanged', (data) => {
        console.log('Participant role changed', data);
        if (data.role === 'moderator') {
          setIsHost(true);
        }
      });
      
      jitsi.addListener('participantJoined', (data) => {
        console.log('Participant joined', data);
        // Update participants list
        updateParticipants();
      });
      
      jitsi.addListener('participantLeft', (data) => {
        console.log('Participant left', data);
        // Update participants list
        updateParticipants();
      });
      
      jitsi.addListener('audioMuteStatusChanged', (data) => {
        console.log('Audio mute status changed', data);
        setIsMuted(data.muted);
      });
      
      jitsi.addListener('videoMuteStatusChanged', (data) => {
        console.log('Video mute status changed', data);
        setIsVideoOn(!data.muted);
      });
      
      jitsi.addListener('screenSharingStatusChanged', (data) => {
        console.log('Screen sharing status changed', data);
        setIsScreenSharing(data.on);
      });
      
      jitsi.addListener('raiseHandUpdated', (data) => {
        console.log('Raise hand updated', data);
        if (data.id === user._id) {
          setIsRaiseHand(data.raiseHand);
        }
        updateParticipants();
      });
      
      jitsi.addListener('recordingStatusChanged', (data) => {
        console.log('Recording status changed', data);
        setIsRecording(data.on);
      });
      
      jitsi.addListener('readyToClose', () => {
        console.log('Ready to close');
        handleLeaveMeeting();
      });
      
      jitsi.addListener('errorOccurred', (error) => {
        console.error('Jitsi error:', error);
        toast.error('An error occurred in the meeting');
      });
      
    } catch (err) {
      console.error('Error joining meeting:', err);
      toast.error('Failed to join meeting');
      setError('Failed to join meeting. Please try again.');
    }
  };
  
  // Update participants list
  const updateParticipants = () => {
    if (apiRef.current) {
      const participants = apiRef.current.getParticipantsInfo();
      setParticipants(participants);
    }
  };
  
  // Toggle mute
  const toggleMute = () => {
    if (apiRef.current) {
      apiRef.current.executeCommand('toggleAudio');
      setIsMuted(!isMuted);
    }
  };
  
  // Toggle video
  const toggleVideo = () => {
    if (apiRef.current) {
      apiRef.current.executeCommand('toggleVideo');
      setIsVideoOn(!isVideoOn);
    }
  };
  
  // Toggle screen share
  const toggleScreenShare = () => {
    if (apiRef.current) {
      apiRef.current.executeCommand('toggleShareScreen');
      setIsScreenSharing(!isScreenSharing);
    }
  };
  
  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };
  
  // Toggle participants panel
  const toggleParticipants = () => {
    setShowParticipants(!showParticipants);
    if (showChat) setShowChat(false);
  };
  
  // Toggle chat panel
  const toggleChat = () => {
    setShowChat(!showChat);
    if (showParticipants) setShowParticipants(false);
  };
  
  // Toggle raise hand
  const toggleRaiseHand = () => {
    if (apiRef.current) {
      apiRef.current.executeCommand('toggleRaiseHand');
      setIsRaiseHand(!isRaiseHand);
    }
  };
  
  // Toggle captions
  const toggleCaptions = () => {
    if (apiRef.current) {
      apiRef.current.executeCommand('toggleSubtitles');
      setIsCaptionOn(!isCaptionOn);
    }
  };
  
  // Start/stop recording
  const toggleRecording = () => {
    if (apiRef.current) {
      if (isRecording) {
        apiRef.current.executeCommand('stopRecording', 'jibri');
      } else {
        apiRef.current.executeCommand('startRecording', {
          mode: 'file',
          dropboxToken: process.env.REACT_APP_DROPBOX_TOKEN,
          shouldShare: true
        });
      }
    }
  };
  
  // Copy meeting link to clipboard
  const copyMeetingLink = () => {
    navigator.clipboard.writeText(meetingLink)
      .then(() => {
        toast.success('Meeting link copied to clipboard');
      })
      .catch(err => {
        console.error('Failed to copy meeting link:', err);
        toast.error('Failed to copy meeting link');
      });
  };
  
  // Open menu
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  // Close menu
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  // Leave meeting
  const handleLeaveMeeting = () => {
    if (apiRef.current) {
      apiRef.current.dispose();
      jitsiRef.current = null;
      apiRef.current = null;
    }
    navigate('/');
  };
  
  // End meeting for all
  const handleEndMeeting = () => {
    if (apiRef.current && isHost) {
      if (window.confirm('Are you sure you want to end the meeting for all participants?')) {
        apiRef.current.executeCommand('endConference');
        handleLeaveMeeting();
      }
    } else {
      handleLeaveMeeting();
    }
  };
  
  // Render loading state
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
        <Typography variant="body1" sx={{ ml: 2 }}>Joining meeting...</Typography>
      </Box>
    );
  }
  
  // Render error state
  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 8, textAlign: 'center' }}>
        <Typography variant="h5" color="error" gutterBottom>
          Error
        </Typography>
        <Typography variant="body1" paragraph>
          {error}
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => window.location.reload()}
          sx={{ mt: 2 }}
        >
          Try Again
        </Button>
      </Container>
    );
  }
  
  return (
    <MeetingContainer>
      {/* Meeting header */}
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          p: 1,
          backgroundColor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
          height: '56px'
        }}
      >
        <Box display="flex" alignItems="center">
          <Typography variant="h6" noWrap sx={{ ml: 1, maxWidth: '300px' }}>
            {meetingTitle}
          </Typography>
          <IconButton 
            size="small" 
            onClick={() => setShowMeetingInfo(true)}
            sx={{ ml: 1 }}
          >
            <InfoIcon fontSize="small" />
          </IconButton>
        </Box>
        
        <Box>
          <Tooltip title="Meeting information">
            <IconButton onClick={() => setShowMeetingInfo(true)}>
              <InfoIcon />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="More options">
            <IconButton onClick={handleMenuOpen}>
              <MoreVertIcon />
            </IconButton>
          </Tooltip>
        </Box>
        
        {/* More options menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <MenuItem onClick={toggleFullscreen}>
            <ListItemIcon>
              {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
            </ListItemIcon>
            <ListItemText primary={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'} />
          </MenuItem>
          
          <MenuItem onClick={toggleCaptions}>
            <ListItemIcon>
              <CaptionIcon />
            </ListItemIcon>
            <ListItemText primary={isCaptionOn ? 'Turn off captions' : 'Turn on captions'} />
          </MenuItem>
          
          {isHost && (
            <MenuItem onClick={toggleRecording}>
              <ListItemIcon>
                <RecordIcon color={isRecording ? 'error' : 'inherit'} />
              </ListItemIcon>
              <ListItemText 
                primary={isRecording ? 'Stop recording' : 'Start recording'} 
                primaryTypographyProps={{
                  color: isRecording ? 'error' : 'inherit'
                }}
              />
            </MenuItem>
          )}
          
          <Divider />
          
          <MenuItem onClick={copyMeetingLink}>
            <ListItemIcon>
              <LinkIcon />
            </ListItemIcon>
            <ListItemText primary="Copy meeting link" />
          </MenuItem>
          
          <MenuItem onClick={() => {
            copyMeetingLink();
            handleMenuClose();
          }}>
            <ListItemIcon>
              <PersonAddIcon />
            </ListItemIcon>
            <ListItemText primary="Invite people" />
          </MenuItem>
          
          <Divider />
          
          <MenuItem 
            onClick={handleEndMeeting}
            sx={{ color: 'error.main' }}
          >
            <ListItemIcon sx={{ color: 'error.main' }}>
              <LeaveIcon />
            </ListItemIcon>
            <ListItemText 
              primary={isHost ? 'End meeting for all' : 'Leave meeting'} 
              primaryTypographyProps={{
                color: 'error'
              }}
            />
          </MenuItem>
        </Menu>
      </Box>
      
      <MainContent>
        {/* Video container */}
        <VideoContainer ref={jitsiContainerRef}>
          {!jitsiRef.current && (
            <Box textAlign="center" color="white">
              <CircularProgress color="inherit" />
              <Typography variant="body1" sx={{ mt: 2 }}>
                Connecting to meeting...
              </Typography>
            </Box>
          )}
        </VideoContainer>
        
        {/* Side panels */}
        <Box 
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            width: showParticipants || showChat ? (isMobile ? '100%' : '320px') : 0,
            backgroundColor: 'background.paper',
            boxShadow: 3,
            transition: 'width 0.3s ease',
            overflow: 'hidden',
            zIndex: 10,
          }}
        >
          {showParticipants && (
            <Box p={2}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="subtitle1">
                  Participants ({participants.length})
                </Typography>
                <IconButton size="small" onClick={() => setShowParticipants(false)}>
                  <CloseIcon />
                </IconButton>
              </Box>
              
              <Box maxHeight="calc(100vh - 200px)" overflow="auto">
                {participants.map((participant) => (
                  <Box 
                    key={participant.id} 
                    display="flex" 
                    alignItems="center" 
                    p={1}
                    sx={{ '&:hover': { backgroundColor: 'action.hover' } }}
                  >
                    <ParticipantAvatar 
                      src={participant.avatar} 
                      alt={participant.displayName}
                    >
                      {participant.displayName?.charAt(0) || 'U'}
                    </ParticipantAvatar>
                    
                    <Box ml={1} flex={1} overflow="hidden">
                      <Typography noWrap>
                        {participant.displayName || 'Guest'}
                        {participant.role === 'moderator' && (
                          <Chip 
                            label="Host" 
                            size="small" 
                            sx={{ ml: 1, height: '20px' }} 
                          />
                        )}
                      </Typography>
                      <Typography variant="caption" color="textSecondary" noWrap>
                        {participant.audioMuted ? 'Muted' : 'Unmuted'}
                      </Typography>
                    </Box>
                    
                    <Box>
                      {participant.raiseHand && (
                        <Tooltip title="Raised hand">
                          <IconButton size="small" sx={{ mr: 1 }}>
                            <RecordIcon color="primary" />
                          </IconButton>
                        </Tooltip>
                      )}
                      
                      <IconButton size="small" disabled={participant.audioMuted}>
                        {participant.audioMuted ? <MicOffIcon /> : <MicIcon />}
                      </IconButton>
                      
                      <IconButton size="small" disabled={participant.videoMuted}>
                        {participant.videoMuted ? <VideocamOffIcon /> : <VideocamIcon />}
                      </IconButton>
                    </Box>
                  </Box>
                ))}
              </Box>
              
              <Box mt={2}>
                <Button 
                  fullWidth 
                  variant="outlined" 
                  startIcon={<PersonAddIcon />}
                  onClick={copyMeetingLink}
                >
                  Add people
                </Button>
              </Box>
            </Box>
          )}
          
          {showChat && (
            <Box height="100%" display="flex" flexDirection="column">
              <Box 
                p={2} 
                borderBottom="1px solid" 
                borderColor="divider"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="subtitle1">Chat</Typography>
                <IconButton size="small" onClick={() => setShowChat(false)}>
                  <CloseIcon />
                </IconButton>
              </Box>
              
              <Box flex={1} p={2} overflow="auto">
                <Box 
                  p={2} 
                  mb={2} 
                  bgcolor="action.hover" 
                  borderRadius={1}
                  textAlign="center"
                >
                  <Typography variant="caption" color="textSecondary">
                    Meeting chat is not available in this demo
                  </Typography>
                </Box>
              </Box>
              
              <Box p={2} borderTop="1px solid" borderColor="divider">
                <TextField
                  fullWidth
                  placeholder="Type a message..."
                  variant="outlined"
                  size="small"
                  disabled
                />
              </Box>
            </Box>
          )}
        </Box>
      </MainContent>
      
      {/* Controls */}
      <ControlsContainer>
        <ControlButton 
          color={isMuted ? 'error' : 'default'} 
          onClick={toggleMute}
          active={!isMuted}
        >
          {isMuted ? <MicOffIcon /> : <MicIcon />}
        </ControlButton>
        
        <Tooltip title={isVideoOn ? 'Turn off camera' : 'Turn on camera'}>
          <ControlButton 
            color={!isVideoOn ? 'error' : 'default'} 
            onClick={toggleVideo}
            active={isVideoOn}
          >
            {isVideoOn ? <VideocamIcon /> : <VideocamOffIcon />}
          </ControlButton>
        </Tooltip>
        
        <Tooltip title={isScreenSharing ? 'Stop sharing' : 'Share screen'}>
          <ControlButton 
            color={isScreenSharing ? 'primary' : 'default'} 
            onClick={toggleScreenShare}
            active={isScreenSharing}
          >
            {isScreenSharing ? <PresentToAllIcon /> : <ScreenShareIcon />}
          </ControlButton>
        </Tooltip>
        
        <Tooltip title="Raise hand">
          <ControlButton 
            color={isRaiseHand ? 'primary' : 'default'} 
            onClick={toggleRaiseHand}
            active={isRaiseHand}
          >
            <RecordIcon />
          </ControlButton>
        </Tooltip>
        
        <Tooltip title="Participants">
          <ControlButton 
            onClick={toggleParticipants}
            active={showParticipants}
          >
            <Badge badgeContent={participants.length} color="primary">
              <PeopleIcon />
            </Badge>
          </ControlButton>
        </Tooltip>
        
        <Tooltip title="Chat">
          <ControlButton 
            onClick={toggleChat}
            active={showChat}
          >
            <Badge badgeContent={0} color="primary">
              <ChatIcon />
            </Badge>
          </ControlButton>
        </Tooltip>
        
        <Tooltip title="More options">
          <ControlButton onClick={handleMenuOpen}>
            <MoreHorizIcon />
          </ControlButton>
        </Tooltip>
        
        <EndCallButton 
          variant="contained" 
          color="error"
          onClick={handleEndMeeting}
          startIcon={<LeaveIcon />}
        >
          {isHost ? 'End' : 'Leave'}
        </EndCallButton>
      </ControlsContainer>
      
      {/* Meeting info dialog */}
      <Dialog 
        open={showMeetingInfo} 
        onClose={() => setShowMeetingInfo(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Meeting information</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="textSecondary">Meeting title</Typography>
              <Typography variant="body1">{meetingTitle}</Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="textSecondary">Start time</Typography>
              <Typography variant="body1">
                {new Date(meeting?.startTime).toLocaleString()}
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="textSecondary">Meeting ID</Typography>
              <Box display="flex" alignItems="center">
                <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
                  {roomName}
                </Typography>
                <IconButton size="small" onClick={copyMeetingLink} sx={{ ml: 1 }}>
                  <LinkIcon fontSize="small" />
                </IconButton>
              </Box>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="textSecondary">Meeting link</Typography>
              <Box display="flex" alignItems="center">
                <Typography 
                  variant="body2" 
                  sx={{ 
                    flex: 1, 
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    fontFamily: 'monospace'
                  }}
                >
                  {meetingLink}
                </Typography>
                <Button 
                  size="small" 
                  onClick={copyMeetingLink}
                  startIcon={<FileCopyIcon fontSize="small" />}
                >
                  Copy
                </Button>
              </Box>
            </Grid>
            
            {meeting?.settings?.password && (
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="textSecondary">Meeting password</Typography>
                <Typography variant="body1">{meeting.settings.password}</Typography>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowMeetingInfo(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </MeetingContainer>
  );
};

export default Meeting;
