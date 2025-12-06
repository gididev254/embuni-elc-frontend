import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import { 
  Box, 
  Button, 
  Container, 
  Typography, 
  Paper, 
  TextField as MuiTextField,
  InputAdornment as MuiInputAdornment,
  IconButton as MuiIconButton,
  ButtonGroup,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Grid, 
  Card, 
  CardContent, 
  CardActions, 
  Divider as MuiDivider, 
  useMediaQuery,
  useTheme,
  Tabs,
  Tab,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText as MuiListItemText,
  ListItemSecondaryAction,
  ListSubheader,
  Badge,
  Switch,
  Tooltip,
  Menu,
  MenuItem,
  FormControlLabel,
  Checkbox,
  TextField,
  Select,
  InputLabel,
  FormControl,
  RadioGroup,
  Radio,
  FormLabel,
  FormGroup,
  Collapse,
  CircularProgress,
  Backdrop,
  Divider
} from '@mui/material';
import {
  VideoCall as VideoCallIcon,
  MeetingRoom as MeetingRoomIcon,
  Link as LinkIcon,
  ContentCopy as ContentCopyIcon,
  PersonAdd as PersonAddIcon,
  Schedule as ScheduleIcon,
  Videocam as VideocamIcon,
  Mic as MicIcon,
  ScreenShare as ScreenShareIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Add as AddIcon,
  Email as EmailIcon,
  Share as ShareIcon,
  Settings as SettingsIcon,
  Lock as LockIcon,
  LockOpen as LockOpenIcon,
  People as PeopleIcon,
  Person as PersonIcon,
  MoreVert as MoreVertIcon,
  ArrowDropDown as ArrowDropDownIcon,
  Info as InfoIcon,
  Check as CheckIcon,
  AccessTime as AccessTimeIcon,
  Event as EventIcon,
  Language as LanguageIcon,
  FiberManualRecord as FiberManualRecordIcon,
  Group as GroupIcon,
  RecordVoiceOver as RecordVoiceOverIcon,
  ClosedCaption as ClosedCaptionIcon,
  CloudUpload as CloudUploadIcon,
  VideocamOff as VideocamOffIcon,
  MicOff as MicOffIcon,
  MoreHoriz as MoreHorizIcon,
  PersonAdd as PersonAddAltIcon,
  Phone as PhoneIcon,
  Message as MessageIcon,
  PresentToAll as PresentToAllIcon,
  Security as SecurityIcon,
  HelpOutline as HelpOutlineIcon,
  Feedback as FeedbackIcon,
  Fullscreen as FullscreenIcon,
  FullscreenExit as FullscreenExitIcon,
  More as MoreIcon,
  InsertLink as InsertLinkIcon,
  PersonAddAlt as PersonAddAlt1Icon,
  QrCode as QrCodeIcon,
  PhoneAndroid as PhoneAndroidIcon,
  PhoneIphone as PhoneIphoneIcon,
  Computer as ComputerIcon,
  Laptop as LaptopIcon,
  Tablet as TabletIcon,
  Tv as TvIcon,
  Watch as WatchIcon,
  Headset as HeadsetIcon,
  Headphones as HeadphonesIcon,
  KeyboardVoice as KeyboardVoiceIcon,
  VideocamOff as VideocamOffIcon1,
  MicOff as MicOffIcon1,
  ScreenShare as ScreenShareIcon1,
  StopScreenShare as StopScreenShareIcon,
  Chat as ChatIcon,
  Poll as PollIcon,
  EmojiEmotions as EmojiEmotionsIcon,
  InsertEmoticon as InsertEmoticonIcon,
  Gif as GifIcon,
  InsertPhoto as InsertPhotoIcon,
  AttachFile as AttachFileIcon,
  Send as SendIcon,
  MoreVert as MoreVertIcon1,
  Close as CloseIcon1,
  Minimize as MinimizeIcon,
  FilterNone as FilterNoneIcon,
  PictureInPicture as PictureInPictureIcon,
  Cast as CastIcon,
  CastConnected as CastConnectedIcon,
  CastForEducation as CastForEducationIcon,
  CastConnected as CastConnectedIcon1,
  CastForEducation as CastForEducationIcon1,
  Cast as CastIcon1,
  CastConnected as CastConnectedIcon2,
  CastForEducation as CastForEducationIcon2,
  Cast as CastIcon2,
  CastConnected as CastConnectedIcon3,
  CastForEducation as CastForEducationIcon3,
  Cast as CastIcon3,
  CastConnected as CastConnectedIcon4,
  CastForEducation as CastForEducationIcon4,
  Cast as CastIcon4,
  CastConnected as CastConnectedIcon5,
  CastForEducation as CastForEducationIcon5,
  Repeat as RepeatIcon,
  Translate as TranslateIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import meetingService from '../services/meeting.service';
import { useTranslation } from 'react-i18next';

// Styled components
const HeroSection = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(8, 0),
  marginBottom: theme.spacing(4),
  textAlign: 'center',
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[8],
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1, 0),
  padding: theme.spacing(1.5),
  borderRadius: '8px',
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '1rem',
}));

const MeetingHome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // State
  const [tabValue, setTabValue] = useState(0);
  const [meetingCode, setMeetingCode] = useState('');
  const [meetingPassword, setMeetingPassword] = useState('');
  const [meetingTitle, setMeetingTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [upcomingMeetings, setUpcomingMeetings] = useState([]);
  const [pastMeetings, setPastMeetings] = useState([]);
  const [isLoadingMeetings, setIsLoadingMeetings] = useState(true);
  
  // Meeting settings state with Google Meet-like defaults
  const [settings, setSettings] = useState({
    // Core Communication
    videoOnJoin: false,  // Default to video off for better UX
    audioOnJoin: false,  // Default to muted for better UX
    enableLiveCaptions: true,
    enableChat: true,
    enableScreenSharing: true,
    
    // Collaboration Features
    enableBreakoutRooms: false,
    enablePolls: true,
    enableQandA: true,
    enableWhiteboard: true,
    enableHandRaise: true,
    enableReactions: true,
    enableCoHost: true,
    enableCompanionMode: true,
    
    // Security & Control
    requireAuthToJoin: true,  // Google Meet requires sign-in
    enableWaitingRoom: false,
    muteAllOnEntry: false,
    restrictParticipantActions: false,
    enableAttendanceTracking: true,
    enableActivityLogs: true,
    
    // AI & Enhancements
    enableNoiseCancellation: true,
    enableStudioLook: false,
    enableLiveTranslation: false,
    
    // Enterprise & Education
    enableLargeMeetings: false,  // Up to 500 participants
    enableLiveStreaming: false,
    enableGoogleClassroom: false,
    enableAutomatedReports: true,
    enableEngagementDashboards: true,
    
    // Integration & Ecosystem
    enableGoogleCalendar: true,
    enableGmail: true,
    enableGoogleDrive: true,
    enableJamboard: true,
    enableDocsSheetsSlides: true,
    
    // Additional settings
    enableRecording: false,
    enableHandouts: false,
    allowJoinBeforeHost: true,
    requirePassword: false,
  });
  
  // Dialog states
  const [createMeetingDialogOpen, setCreateMeetingDialogOpen] = useState(false);
  const [meetingLink, setMeetingLink] = useState('');
  const [showMeetingLink, setShowMeetingLink] = useState(false);
  const [settingsAnchorEl, setSettingsAnchorEl] = useState(null);
  const [copied, setCopied] = useState(false);
  const [meetingType, setMeetingType] = useState('instant'); // 'instant' or 'scheduled'
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [meetingDuration, setMeetingDuration] = useState(60); // in minutes
  const [timeZone, setTimeZone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [meetingDescription, setMeetingDescription] = useState('');
  const [recurringMeeting, setRecurringMeeting] = useState(false);
  const [recurrence, setRecurrence] = useState({
    frequency: 'weekly',
    interval: 1,
    days: [new Date().getDay()], // Default to current day of week
    endDate: '',
    occurrences: 10,
    endType: 'never' // 'never', 'on', 'after'
  });
  
  // Google Meet-like meeting link format
  const generateMeetingCode = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 10; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
      if (i === 2 || i === 6) result += '-';
    }
    return result;
  };
  
  // Refs
  const meetingLinkRef = useRef(null);
  const settingsMenuRef = useRef(null);
  
  // Generate a random meeting code when component mounts
  useEffect(() => {
    if (meetingType === 'instant' && !meetingCode) {
      setMeetingCode(generateMeetingCode());
    }
  }, [meetingType]);
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Fetch user's meetings
  useEffect(() => {
    const fetchMeetings = async () => {
      if (!user) return;
      
      try {
        setIsLoadingMeetings(true);
        const response = await meetingService.listMeetings();
        const now = new Date();
        
        // Separate upcoming and past meetings
        const upcoming = [];
        const past = [];
        
        response.data.meetings.forEach(meeting => {
          const meetingDate = new Date(meeting.startTime);
          if (meetingDate > now) {
            upcoming.push(meeting);
          } else {
            past.push(meeting);
          }
        });
        
        setUpcomingMeetings(upcoming);
        setPastMeetings(past);
      } catch (error) {
        console.error('Error fetching meetings:', error);
        toast.error('Failed to load meetings');
      } finally {
        setIsLoadingMeetings(false);
      }
    };
    
    fetchMeetings();
  }, [user]);
  
  // Handle create meeting with Google Meet-like functionality
  const handleCreateMeeting = async () => {
    if ((!meetingTitle.trim() || !scheduledDate || !scheduledTime) && meetingType === 'scheduled') {
      toast.error('Please fill in all required fields');
      return;
    }
    
    try {
      setIsCreating(true);
      
      // Generate a meeting code if not already set
      const meetingId = meetingCode || generateMeetingCode();
      
      // Prepare meeting data with Google Meet-like structure
      const meetingData = {
        title: meetingType === 'scheduled' ? meetingTitle : 'Quick Meeting',
        description: meetingDescription,
        type: meetingType,
        roomName: meetingId, // Use the generated meeting code
        settings: {
          ...settings,
          // Enforce Google Meet-like defaults
          requireAuthToJoin: true, // Google Meet requires sign-in
          enableLiveCaptions: true,
          enableNoiseSuppression: true,
          // Override some settings based on meeting type
          allowJoinBeforeHost: meetingType === 'instant' || settings.allowJoinBeforeHost,
          requirePassword: meetingType === 'scheduled' && settings.requirePassword,
        },
        // Add meeting metadata
        metadata: {
          createdBy: user?.id || 'anonymous',
          createdAt: new Date().toISOString(),
          meetingOptions: {
            isBreakoutRoom: false,
            isRecurring: recurringMeeting,
            isRecorded: settings.enableRecording,
            isStreamed: settings.enableLiveStreaming,
            hasLiveCaptions: settings.enableLiveCaptions
          }
        }
      };
      
      // Handle scheduling for non-instant meetings
      if (meetingType === 'scheduled') {
        const startTime = new Date(`${scheduledDate}T${scheduledTime}`);
        const endTime = new Date(startTime.getTime() + meetingDuration * 60000);
        
        Object.assign(meetingData, {
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          timeZone: timeZone,
          isRecurring: recurringMeeting
        });
        
        if (recurringMeeting) {
          meetingData.recurrence = {
            ...recurrence,
            days: recurrence.days.map(day => parseInt(day)),
            endDate: recurrence.endDate ? new Date(recurrence.endDate).toISOString() : null,
          };
        }
      } else {
        // For instant meetings, set start time to now and duration to 60 minutes
        Object.assign(meetingData, {
          startTime: new Date().toISOString(),
          endTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
          isRecurring: false
        });
      }
      
      // Create the meeting in the backend
      const response = await meetingService.createMeeting(meetingData);
      const { meeting } = response.data;
      
      // Generate the meeting URL with the meeting code
      const meetingUrl = `${window.location.origin}/meeting/${meeting.roomName || meetingId}`;
      setMeetingLink(meetingUrl);
      
      // Show the meeting link dialog
      setShowMeetingLink(true);
      
      // If it's an instant meeting, navigate directly to the meeting
      if (meetingType === 'instant') {
        navigate(`/meeting/${meeting.roomName || meetingId}`);
      } else {
        // For scheduled meetings, show the meeting details
        setMeetingTitle(meeting.title || 'Scheduled Meeting');
      }
      
    } catch (error) {
      console.error('Error creating meeting:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to create meeting');
    } finally {
      setIsCreating(false);
    }
  };
  
  // Copy meeting link to clipboard
  const copyMeetingLink = () => {
    if (meetingLinkRef.current) {
      navigator.clipboard.writeText(meetingLink);
      setCopied(true);
      toast.success('Meeting link copied to clipboard');
      
      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    }
  };
  
  // Open settings menu
  const handleSettingsMenuOpen = (event) => {
    setSettingsAnchorEl(event.currentTarget);
  };
  
  // Close settings menu
  const handleSettingsMenuClose = () => {
    setSettingsAnchorEl(null);
  };
  
  // Toggle setting
  const toggleSetting = (setting) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };
  
  // Handle meeting type change
  const handleMeetingTypeChange = (type) => {
    setMeetingType(type);
  };
  
  // Format date for display
  const formatDateForInput = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  };
  
  // Format time for display
  const formatTimeForInput = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toTimeString().slice(0, 5);
  };
  
  // Handle join meeting
  const handleJoinMeeting = async () => {
    if (!meetingCode.trim()) {
      toast.error('Please enter a meeting code');
      return;
    }
    
    try {
      setIsJoining(true);
      // Navigate to the meeting room
      navigate(`/meeting/${meetingCode.trim()}`, {
        state: { password: meetingPassword }
      });
    } catch (error) {
      console.error('Error joining meeting:', error);
      toast.error('Failed to join meeting');
    } finally {
      setIsJoining(false);
    }
  };
  
  // Copy meeting link to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        toast.success('Copied to clipboard');
      })
      .catch(err => {
        console.error('Failed to copy:', err);
        toast.error('Failed to copy to clipboard');
      });
  };
  
  // Format date
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Features data
  const features = [
    {
      icon: <VideocamIcon color="primary" fontSize="large" />,
      title: 'High-quality video',
      description: 'Crystal clear video calls with HD quality and optimized for your connection.'
    },
    {
      icon: <MicIcon color="primary" fontSize="large" />,
      title: 'Clear audio',
      description: 'Advanced noise suppression and echo cancellation for clear conversations.'
    },
    {
      icon: <ScreenShareIcon color="primary" fontSize="large" />,
      title: 'Screen sharing',
      'description': 'Share your entire screen or just a specific window with meeting participants.'
    },
    {
      icon: <PersonAddIcon color="primary" fontSize="large" />,
      title: 'Easy invites',
      description: 'Invite participants with a simple link, no account required to join.'
    }
  ];
  
  // Render meeting settings menu with organized sections
  const renderSettingsMenu = () => (
    <Menu
      anchorEl={settingsAnchorEl}
      open={Boolean(settingsAnchorEl)}
      onClose={handleSettingsMenuClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      PaperProps={{
        style: {
          width: 400,
          maxHeight: '80vh',
          overflowY: 'auto',
        },
      }}
    >
      <ListSubheader>Meeting settings</ListSubheader>
      <MuiDivider />
      
      {/* Core Communication */}
      <ListSubheader>🟢 Core Communication</ListSubheader>
      <MuiDivider />
      
      <ListItem>
        <ListItemAvatar>
          <Avatar><VideocamIcon /></Avatar>
        </ListItemAvatar>
        <MuiListItemText 
          primary="Video on join" 
          secondary="Turn on your video when joining a meeting" 
        />
        <Switch 
          edge="end" 
          checked={settings.videoOnJoin} 
          onChange={() => toggleSetting('videoOnJoin')} 
        />
      </ListItem>
      
      <ListItem>
        <ListItemAvatar>
          <Avatar><MicIcon /></Avatar>
        </ListItemAvatar>
        <MuiListItemText 
          primary="Audio on join" 
          secondary="Turn on your microphone when joining a meeting" 
        />
        <Switch 
          edge="end" 
          checked={settings.audioOnJoin} 
          onChange={() => toggleSetting('audioOnJoin')} 
        />
      </ListItem>
      
      <ListItem>
        <ListItemAvatar>
          <Avatar><ClosedCaptionIcon /></Avatar>
        </ListItemAvatar>
        <MuiListItemText 
          primary="Live captions" 
          secondary="Show automatic captions during the meeting" 
        />
        <Switch 
          edge="end" 
          checked={settings.enableLiveCaptions} 
          onChange={() => toggleSetting('enableLiveCaptions')} 
        />
      </ListItem>
      
      {/* Collaboration Features */}
      <ListSubheader>👥 Collaboration</ListSubheader>
      <MuiDivider />
      
      <ListItem>
        <ListItemAvatar>
          <Avatar><GroupIcon /></Avatar>
        </ListItemAvatar>
        <MuiListItemText 
          primary="Breakout rooms" 
          secondary="Create smaller group sessions" 
        />
        <Switch 
          edge="end" 
          checked={settings.enableBreakoutRooms} 
          onChange={() => toggleSetting('enableBreakoutRooms')} 
        />
      </ListItem>
      
      <ListItem>
        <ListItemAvatar>
          <Avatar><PollIcon /></Avatar>
        </ListItemAvatar>
        <MuiListItemText 
          primary="Polls & Q&A" 
          secondary="Enable interactive engagement features" 
        />
        <Switch 
          edge="end" 
          checked={settings.enablePolls && settings.enableQandA} 
          onChange={(e) => {
            setSettings(prev => ({
              ...prev,
              enablePolls: e.target.checked,
              enableQandA: e.target.checked
            }));
          }} 
        />
      </ListItem>
      
      <ListItem>
        <ListItemAvatar>
          <Avatar><RecordVoiceOverIcon /></Avatar>
        </ListItemAvatar>
        <MuiListItemText 
          primary="Raise hand & reactions" 
          secondary="Allow participants to interact non-verbally" 
        />
        <Switch 
          edge="end" 
          checked={settings.enableHandRaise && settings.enableReactions} 
          onChange={(e) => {
            setSettings(prev => ({
              ...prev,
              enableHandRaise: e.target.checked,
              enableReactions: e.target.checked
            }));
          }} 
        />
      </ListItem>
      
      {/* Security & Control */}
      <ListSubheader>🔒 Security & Control</ListSubheader>
      <MuiDivider />
      
      <ListItem>
        <ListItemAvatar>
          <Avatar><LockIcon /></Avatar>
        </ListItemAvatar>
        <MuiListItemText 
          primary="Require authentication" 
          secondary="Only signed-in users can join" 
        />
        <Switch 
          edge="end" 
          checked={settings.requireAuthToJoin} 
          onChange={() => toggleSetting('requireAuthToJoin')} 
        />
      </ListItem>
      
      <ListItem>
        <ListItemAvatar>
          <Avatar><PeopleIcon /></Avatar>
        </ListItemAvatar>
        <MuiListItemText 
          primary="Waiting room" 
          secondary="Admit participants one by one" 
        />
        <Switch 
          edge="end" 
          checked={settings.enableWaitingRoom} 
          onChange={() => toggleSetting('enableWaitingRoom')} 
        />
      </ListItem>
      
      <ListItem>
        <ListItemAvatar>
          <Avatar><SecurityIcon /></Avatar>
        </ListItemAvatar>
        <MuiListItemText 
          primary="Restrict participant actions" 
          secondary="Limit what participants can do" 
        />
        <Switch 
          edge="end" 
          checked={settings.restrictParticipantActions} 
          onChange={() => toggleSetting('restrictParticipantActions')} 
        />
      </ListItem>
      
      {/* AI & Enhancements */}
      <ListSubheader>✨ AI & Enhancements</ListSubheader>
      <MuiDivider />
      
      <ListItem>
        <ListItemAvatar>
          <Avatar><MicOffIcon /></Avatar>
        </ListItemAvatar>
        <MuiListItemText 
          primary="Noise cancellation" 
          secondary="Reduce background noise" 
        />
        <Switch 
          edge="end" 
          checked={settings.enableNoiseCancellation} 
          onChange={() => toggleSetting('enableNoiseCancellation')} 
        />
      </ListItem>
      
      <ListItem>
        <ListItemAvatar>
          <Avatar><VideocamIcon /></Avatar>
        </ListItemAvatar>
        <MuiListItemText 
          primary="Studio look" 
          secondary="Enhance your video quality" 
        />
        <Switch 
          edge="end" 
          checked={settings.enableStudioLook} 
          onChange={() => toggleSetting('enableStudioLook')} 
        />
      </ListItem>
      
      <ListItem>
        <ListItemAvatar>
          <Avatar><TranslateIcon /></Avatar>
        </ListItemAvatar>
        <MuiListItemText 
          primary="Live translation" 
          secondary="Translate captions in real-time" 
        />
        <Switch 
          edge="end" 
          checked={settings.enableLiveTranslation} 
          onChange={() => toggleSetting('enableLiveTranslation')} 
        />
      </ListItem>
      
      <MuiDivider />
      <ListSubheader>Advanced</ListSubheader>
      
      <ListItem>
        <MuiListItemText 
          primary="Enable recording" 
          secondary="Allow recording of the meeting" 
        />
        <Switch 
          edge="end" 
          checked={settings.enableRecording} 
          onChange={() => toggleSetting('enableRecording')} 
        />
      </ListItem>
      
      <ListItem>
        <MuiListItemText 
          primary="Breakout rooms" 
          secondary="Allow creating smaller groups" 
        />
        <Switch 
          edge="end" 
          checked={settings.enableBreakoutRooms} 
          onChange={() => toggleSetting('enableBreakoutRooms')} 
        />
      </ListItem>
      
      <ListItem>
        <MuiListItemText 
          primary="Polls" 
          secondary="Allow creating and conducting polls" 
        />
        <Switch 
          edge="end" 
          checked={settings.enablePolls} 
          onChange={() => toggleSetting('enablePolls')} 
        />
      </ListItem>
      
      <ListItem>
        <MuiListItemText 
          primary="Q&A" 
          secondary="Enable Q&A feature" 
        />
        <Switch 
          edge="end" 
          checked={settings.enableQandA} 
          onChange={() => toggleSetting('enableQandA')} 
        />
      </ListItem>
      
      <ListItem>
        <MuiListItemText 
          primary="Whiteboard" 
          secondary="Enable collaborative whiteboard" 
        />
        <Switch 
          edge="end" 
          checked={settings.enableWhiteboard} 
          onChange={() => toggleSetting('enableWhiteboard')} 
        />
      </ListItem>
      
      <ListItem>
        <MuiListItemText 
          primary="Handouts" 
          secondary="Allow sharing handouts" 
        />
        <Switch 
          edge="end" 
          checked={settings.enableHandouts} 
          onChange={() => toggleSetting('enableHandouts')} 
        />
      </ListItem>
      
      <ListItem>
        <MuiListItemText 
          primary="Live streaming" 
          secondary="Allow live streaming to YouTube or other platforms" 
        />
        <Switch 
          edge="end" 
          checked={settings.enableLiveStreaming} 
          onChange={() => toggleSetting('enableLiveStreaming')} 
        />
      </ListItem>
      
      <ListItem>
        <MuiListItemText 
          primary="Live translation" 
          secondary="Enable live translation of captions" 
        />
        <Switch 
          edge="end" 
          checked={settings.enableLiveTranslation} 
          onChange={() => toggleSetting('enableLiveTranslation')} 
        />
      </ListItem>
    </Menu>
  );
  
  // Render meeting link dialog with Google Meet-like UI
  const renderMeetingLinkDialog = () => (
    <Dialog 
      open={showMeetingLink} 
      onClose={() => setShowMeetingLink(false)}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxWidth: '500px',
          width: '100%',
          p: 0,
        }
      }}
    >
      <Box sx={{ p: 3, borderBottom: '1px solid #e0e0e0' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" fontWeight={500}>
            {meetingType === 'instant' ? 'Ready to join your meeting?' : 'Your meeting is scheduled'}
          </Typography>
          <IconButton 
            onClick={() => setShowMeetingLink(false)}
            size="small"
            sx={{ color: 'text.secondary' }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        
        {meetingType === 'scheduled' && (
          <Box mb={3}>
            <Box display="flex" alignItems="center" mb={1}>
              <EventIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="subtitle1" fontWeight={500}>
                {new Date(scheduledDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" mb={1}>
              <AccessTimeIcon color="primary" sx={{ mr: 1, opacity: 0.7 }} />
              <Typography variant="body2">
                {scheduledTime} - {new Date(new Date(`${scheduledDate}T${scheduledTime}`).getTime() + meetingDuration * 60000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                {' '}({Intl.DateTimeFormat().resolvedOptions().timeZone.replace(/_/g, ' ')})
              </Typography>
            </Box>
            {recurringMeeting && (
              <Box display="flex" alignItems="center" mb={1}>
                <RepeatIcon color="primary" sx={{ mr: 1, opacity: 0.7 }} />
                <Typography variant="body2">
                  Repeats {recurrence.frequency}
                </Typography>
              </Box>
            )}
          </Box>
        )}
        
        <Box sx={{ 
          bgcolor: '#f8f9fa', 
          p: 2, 
          borderRadius: 1,
          position: 'relative',
          mb: 2
        }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            {meetingType === 'instant' ? 'Joining info' : 'Meeting details'}
          </Typography>
          
          <Box display="flex" alignItems="center" mb={1}>
            <Typography variant="body2" sx={{ minWidth: 100, color: 'text.secondary' }}>
              Meeting ID:
            </Typography>
            <Typography variant="body1" fontWeight={500}>
              {meetingLink.split('/').pop()}
            </Typography>
            <Tooltip title={copied ? 'Copied!' : 'Copy meeting ID'}>
              <IconButton 
                size="small" 
                onClick={() => {
                  navigator.clipboard.writeText(meetingLink.split('/').pop());
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                sx={{ ml: 1 }}
              >
                {copied ? <CheckCircleIcon color="success" fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
              </IconButton>
            </Tooltip>
          </Box>
          
          <Box display="flex" alignItems="center">
            <Typography variant="body2" sx={{ minWidth: 100, color: 'text.secondary' }}>
              Link:
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                flex: 1, 
                whiteSpace: 'nowrap', 
                overflow: 'hidden', 
                textOverflow: 'ellipsis',
                mr: 1
              }}
            >
              {meetingLink}
            </Typography>
            <Tooltip title={copied ? 'Copied!' : 'Copy link'}>
              <IconButton 
                size="small" 
                onClick={copyMeetingLink}
              >
                {copied ? <CheckCircleIcon color="success" fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        
        <Box mt={3}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Share with others
          </Typography>
          
          <Box display="flex" gap={1} flexWrap="wrap">
            <Button 
              variant="outlined" 
              size="small"
              startIcon={<ContentCopyIcon />}
              onClick={() => {
                copyMeetingLink();
                toast.success('Meeting link copied to clipboard');
              }}
              sx={{ textTransform: 'none', borderRadius: 2 }}
            >
              Copy link
            </Button>
            
            <Button 
              variant="outlined" 
              size="small"
              startIcon={<EmailIcon />}
              onClick={() => {
                const emailSubject = `Join my meeting: ${meetingTitle || 'Quick Meeting'}`;
                const emailBody = `You're invited to join my meeting.\n\nJoin: ${meetingLink}\n\n`;
                window.open(`mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`);
              }}
              sx={{ textTransform: 'none', borderRadius: 2 }}
            >
              Email
            </Button>
            
            <Button 
              variant="outlined" 
              size="small"
              startIcon={<ShareIcon />}
              onClick={() => {
                const text = `Join my meeting: ${meetingLink}`;
                if (navigator.share) {
                  navigator.share({
                    title: 'Join my meeting',
                    text: text,
                    url: meetingLink,
                  }).catch(console.error);
                } else {
                  copyMeetingLink();
                  toast.success('Meeting link copied. Share it with others.');
                }
              }}
              sx={{ textTransform: 'none', borderRadius: 2 }}
            >
              Share
            </Button>
            
            <Button 
              variant="outlined" 
              size="small"
              startIcon={<QrCodeIcon />}
              onClick={() => {
                // TODO: Implement QR code generation
                toast.info('QR code generation coming soon');
              }}
              sx={{ textTransform: 'none', borderRadius: 2 }}
            >
              QR Code
            </Button>
          </Box>
        </Box>
        
        <Box mt={3} display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center">
            <SecurityIcon color="primary" fontSize="small" sx={{ mr: 1, opacity: 0.7 }} />
            <Typography variant="caption" color="text.secondary">
              {settings.requireAuthToJoin ? 'Signed-in users can join' : 'Anyone with the link can join'}
            </Typography>
          </Box>
          
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => {
              setShowMeetingLink(false);
              navigate(meetingLink.replace(window.location.origin, ''));
            }}
            startIcon={<VideocamIcon />}
            sx={{ borderRadius: 2, textTransform: 'none', px: 3, py: 1 }}
          >
            {meetingType === 'instant' ? 'Join now' : 'Add to calendar'}
          </Button>
        </Box>
      </Box>
      
      {meetingType === 'scheduled' && (
        <Box sx={{ bgcolor: '#f8f9fa', p: 2, borderTop: '1px solid #e0e0e0' }}>
          <Typography variant="body2" color="text.secondary" align="center">
            A calendar invite has been sent to your email
          </Typography>
        </Box>
      )}
    </Dialog>
  );
  
  // Render create meeting dialog with Google Meet-like UI
  const renderCreateMeetingDialog = () => {
    return (
      <Dialog 
        open={createMeetingDialogOpen} 
        onClose={() => setCreateMeetingDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            maxWidth: '600px',
            width: '100%',
            p: 0,
          }
        }}
      >
        <Box sx={{ p: 3, borderBottom: '1px solid #e0e0e0' }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6" fontWeight={500}>
              {meetingType === 'instant' ? 'Start an instant meeting' : 'Schedule a meeting'}
            </Typography>
            <IconButton 
              onClick={() => setCreateMeetingDialogOpen(false)}
              size="small"
              sx={{ color: 'text.secondary' }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          
          {/* Meeting type toggle */}
          <Box mb={4}>
            <ButtonGroup fullWidth sx={{ borderRadius: 2, overflow: 'hidden', boxShadow: '0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15)' }}>
              <Button 
                variant={meetingType === 'instant' ? 'contained' : 'outlined'}
                onClick={() => handleMeetingTypeChange('instant')}
                sx={{
                  textTransform: 'none',
                  py: 1.5,
                  borderRight: '1px solid #e0e0e0',
                  '&.MuiButton-outlined': {
                    backgroundColor: 'white',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)'
                    }
                  }
                }}
              >
                <Box textAlign="center" width="100%">
                  <VideocamIcon sx={{ display: 'block', mx: 'auto', mb: 1 }} />
                  <Typography variant="body2" fontWeight={500}>New meeting</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Start an instant meeting
                  </Typography>
                </Box>
              </Button>
              <Button 
                variant={meetingType === 'scheduled' ? 'contained' : 'outlined'}
                onClick={() => handleMeetingTypeChange('scheduled')}
                sx={{
                  textTransform: 'none',
                  py: 1.5,
                  '&.MuiButton-outlined': {
                    backgroundColor: 'white',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)'
                    }
                  }
                }}
              >
                <Box textAlign="center" width="100%">
                  <EventIcon sx={{ display: 'block', mx: 'auto', mb: 1 }} />
                  <Typography variant="body2" fontWeight={500}>Schedule</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Set a time for later
                  </Typography>
                </Box>
              </Button>
            </ButtonGroup>
          </Box>
          
          {meetingType === 'scheduled' ? (
            <Box>
              <Box mb={3}>
                <MuiTextField
                  fullWidth
                  label="Title"
                  variant="outlined"
                  value={meetingTitle}
                  onChange={(e) => setMeetingTitle(e.target.value)}
                  margin="normal"
                  placeholder="What's the meeting about?"
                  InputProps={{
                    startAdornment: (
                      <MuiInputAdornment position="start">
                        <EventIcon color="action" />
                      </MuiInputAdornment>
                    ),
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
                
                <MuiTextField
                  fullWidth
                  label="Description (optional)"
                  variant="outlined"
                  value={meetingDescription}
                  onChange={(e) => setMeetingDescription(e.target.value)}
                  margin="normal"
                  multiline
                  rows={3}
                  placeholder="Add a description"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
                
                <Grid container spacing={2} mt={0}>
                  <Grid item xs={12} sm={6}>
                    <MuiTextField
                      fullWidth
                      label="Date"
                      type="date"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      margin="normal"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      InputProps={{
                        startAdornment: (
                          <MuiInputAdornment position="start">
                            <EventIcon fontSize="small" color="action" />
                          </MuiInputAdornment>
                        ),
                      }}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <MuiTextField
                      fullWidth
                      label="Time"
                      type="time"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      margin="normal"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      InputProps={{
                        startAdornment: (
                          <MuiInputAdornment position="start">
                            <AccessTimeIcon fontSize="small" color="action" />
                          </MuiInputAdornment>
                        ),
                      }}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <MuiTextField
                      fullWidth
                      label="Duration"
                      select
                      value={meetingDuration}
                      onChange={(e) => setMeetingDuration(Number(e.target.value))}
                      margin="normal"
                      SelectProps={{
                        native: true,
                      }}
                      InputProps={{
                        startAdornment: (
                          <MuiInputAdornment position="start">
                            <AccessTimeIcon fontSize="small" color="action" />
                          </MuiInputAdornment>
                        ),
                      }}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    >
                      <option value={15}>15 minutes</option>
                      <option value={30}>30 minutes</option>
                      <option value={60}>1 hour</option>
                      <option value={90}>1.5 hours</option>
                      <option value={120}>2 hours</option>
                      <option value={180}>3 hours</option>
                      <option value={0}>No time limit</option>
                    </MuiTextField>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth margin="normal">
                      <MuiTextField
                        select
                        fullWidth
                        label="Time zone"
                        value={timeZone}
                        onChange={(e) => setTimeZone(e.target.value)}
                        variant="outlined"
                        InputProps={{
                          startAdornment: (
                            <MuiInputAdornment position="start">
                              <LanguageIcon fontSize="small" color="action" />
                            </MuiInputAdornment>
                          ),
                        }}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                      >
                        <option value={Intl.DateTimeFormat().resolvedOptions().timeZone}>
                          {Intl.DateTimeFormat().resolvedOptions().timeZone}
                        </option>
                        <option value="UTC">UTC</option>
                        <option value="America/New_York">Eastern Time (ET)</option>
                        <option value="America/Chicago">Central Time (CT)</option>
                        <option value="America/Denver">Mountain Time (MT)</option>
                        <option value="America/Los_Angeles">Pacific Time (PT)</option>
                        <option value="Europe/London">London (GMT/BST)</option>
                        <option value="Europe/Paris">Paris (CET/CEST)</option>
                        <option value="Asia/Tokyo">Tokyo (JST)</option>
                        <option value="Asia/Shanghai">Shanghai (CST)</option>
                        <option value="Asia/Dubai">Dubai (GST)</option>
                        <option value="Asia/Kolkata">India (IST)</option>
                      </MuiTextField>
                    </FormControl>
                  </Grid>
                  
                  {/* Recurring meeting option */}
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={recurringMeeting}
                          onChange={(e) => setRecurringMeeting(e.target.checked)}
                          color="primary"
                        />
                      }
                      label={
                        <Box>
                          <Typography variant="body2">Recurring meeting</Typography>
                          <Typography variant="caption" color="textSecondary">
                            Set up a recurring meeting
                          </Typography>
                        </Box>
                      }
                      sx={{ mt: 1 }}
                    />
                    
                    {recurringMeeting && (
                      <Box mt={2} pl={4}>
                        <FormControl component="fieldset" fullWidth>
                          <FormLabel component="legend" sx={{ mb: 1, fontWeight: 500 }}>Recurrence</FormLabel>
                          <RadioGroup 
                            row 
                            value={recurrence.frequency}
                            onChange={(e) => setRecurrence({...recurrence, frequency: e.target.value})}
                          >
                            <FormControlLabel value="daily" control={<Radio />} label="Daily" />
                            <FormControlLabel value="weekly" control={<Radio />} label="Weekly" />
                            <FormControlLabel value="monthly" control={<Radio />} label="Monthly" />
                          </RadioGroup>
                        </FormControl>
                        
                        {recurrence.frequency === 'weekly' && (
                          <Box mt={2}>
                            <FormLabel component="legend" sx={{ mb: 1, fontWeight: 500, display: 'block' }}>Repeat on</FormLabel>
                            <Grid container spacing={1}>
                              {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, index) => (
                                <Grid item key={day}>
                                  <Chip
                                    label={day.substring(0, 3)}
                                    variant={recurrence.days.includes(index.toString()) ? 'filled' : 'outlined'}
                                    color={recurrence.days.includes(index.toString()) ? 'primary' : 'default'}
                                    onClick={() => {
                                      const newDays = [...recurrence.days];
                                      const dayIndex = newDays.indexOf(index.toString());
                                      if (dayIndex === -1) {
                                        newDays.push(index.toString());
                                      } else {
                                        newDays.splice(dayIndex, 1);
                                      }
                                      setRecurrence({...recurrence, days: newDays});
                                    }}
                                    sx={{ minWidth: 40 }}
                                  />
                                </Grid>
                              ))}
                            </Grid>
                          </Box>
                        )}
                        
                        <Box mt={3}>
                          <FormLabel component="legend" sx={{ mb: 1, fontWeight: 500, display: 'block' }}>Ends</FormLabel>
                          <RadioGroup 
                            value={recurrence.endType}
                            onChange={(e) => setRecurrence({...recurrence, endType: e.target.value})}
                          >
                            <FormControlLabel 
                              value="never" 
                              control={<Radio />} 
                              label="Never" 
                              sx={{ mb: 1 }}
                            />
                            <FormControlLabel 
                              value="on" 
                              control={<Radio />} 
                              label={
                                <Box display="flex" alignItems="center">
                                  <span>On</span>
                                  <MuiTextField
                                    type="date"
                                    value={recurrence.endDate}
                                    onChange={(e) => setRecurrence({...recurrence, endDate: e.target.value})}
                                    disabled={recurrence.endType !== 'on'}
                                    size="small"
                                    sx={{ ml: 1, '& .MuiOutlinedInput-root': { height: 40 } }}
                                  />
                                </Box>
                              } 
                              sx={{ mb: 1 }}
                            />
                            <FormControlLabel 
                              value="after" 
                              control={<Radio />} 
                              label={
                                <Box display="flex" alignItems="center">
                                  <span>After</span>
                                  <MuiTextField
                                    type="number"
                                    value={recurrence.occurrences}
                                    onChange={(e) => setRecurrence({...recurrence, occurrences: parseInt(e.target.value) || 1})}
                                    disabled={recurrence.endType !== 'after'}
                                    size="small"
                                    inputProps={{ min: 1, max: 100 }}
                                    sx={{ mx: 1, width: 80, '& .MuiOutlinedInput-root': { height: 40 } }}
                                  />
                                  <span>occurrences</span>
                                </Box>
                              } 
                            />
                          </RadioGroup>
                        </Box>
                      </Box>
                    )}
                  </Grid>
                </Grid>
              </Box>
              
              {/* Settings button */}
              <Box display="flex" justifyContent="space-between" alignItems="center" mt={3}>
                <Button
                  variant="text"
                  startIcon={<SettingsIcon />}
                  onClick={(e) => setSettingsAnchorEl(e.currentTarget)}
                  sx={{ textTransform: 'none' }}
                >
                  Meeting settings
                </Button>
                
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={handleCreateMeeting}
                  disabled={isCreating || !scheduledDate || !scheduledTime}
                  sx={{ borderRadius: 2, textTransform: 'none', px: 3 }}
                >
                  {isCreating ? 'Scheduling...' : 'Schedule'}
                </Button>
              </Box>
            </Box>
          ) : (
            <Box>
              <Box mb={3}>
                <MuiTextField
                  fullWidth
                  label="Meeting title (optional)"
                  variant="outlined"
                  value={meetingTitle}
                  onChange={(e) => setMeetingTitle(e.target.value)}
                  margin="normal"
                  placeholder="Quick meeting"
                  InputProps={{
                    startAdornment: (
                      <MuiInputAdornment position="start">
                        <VideocamIcon color="action" />
                      </MuiInputAdornment>
                    ),
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Box>
              
              <Box display="flex" justifyContent="space-between" alignItems="center" mt={4}>
                <Button
                  variant="text"
                  startIcon={<SettingsIcon />}
                  onClick={(e) => setSettingsAnchorEl(e.currentTarget)}
                  sx={{ textTransform: 'none' }}
                >
                  Meeting settings
                </Button>
                
                <Button 
                  variant="contained" 
                  color="primary" 
                  startIcon={<VideocamIcon />}
                  onClick={handleCreateMeeting}
                  disabled={isCreating}
                  sx={{ borderRadius: 2, textTransform: 'none', px: 3 }}
                >
                  {isCreating ? 'Creating...' : 'Start now'}
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Dialog>
    );
  };
  
  return (
    <Box>
      {/* Hero Section */}
      <HeroSection>
        <Container maxWidth="md">
          <Typography variant="h3" component="h1" gutterBottom>
            Premium video meetings for everyone
          </Typography>
          <Typography variant="h6" paragraph>
            Secure, reliable video meetings with unlimited participants and recording.
          </Typography>
          
          <Box mt={4} display="flex" justifyContent="center" flexWrap="wrap" gap={2}>
            <StyledButton
              variant="contained"
              color="secondary"
              size="large"
              startIcon={<VideoCallIcon />}
              onClick={() => setTabValue(0)}
              sx={{ minWidth: '200px' }}
            >
              New Meeting
            </StyledButton>
            
            <Box display="flex" alignItems="center" width={isMobile ? '100%' : 'auto'}>
              <TextField
                fullWidth={isMobile}
                variant="outlined"
                size="small"
                placeholder="Enter a code or link"
                value={meetingCode}
                onChange={(e) => setMeetingCode(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleJoinMeeting()}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MeetingRoomIcon />
                    </InputAdornment>
                  ),
                  style: { 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '8px'
                  }
                }}
                sx={{ 
                  mr: isMobile ? 0 : 1,
                  mt: isMobile ? 1 : 0,
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      border: 'none',
                    },
                  },
                }}
              />
              {!isMobile && (
                <StyledButton
                  variant="contained"
                  color="primary"
                  onClick={handleJoinMeeting}
                  disabled={!meetingCode.trim()}
                >
                  Join
                </StyledButton>
              )}
            </Box>
            
            {isMobile && (
              <StyledButton
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleJoinMeeting}
                disabled={!meetingCode.trim()}
              >
                Join Meeting
              </StyledButton>
            )}
          </Box>
        </Container>
      </HeroSection>
      
      <Container maxWidth="lg">
        {/* Main Content */}
        <Box mb={6}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            variant="fullWidth"
            indicatorColor="primary"
            textColor="primary"
            sx={{ mb: 3 }}
          >
            <Tab label="New Meeting" />
            <Tab label="Upcoming" />
            <Tab label="Past" />
          </Tabs>
          
          {/* Tab Content */}
          {tabValue === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper 
                  elevation={3} 
                  sx={{ 
                    p: 3, 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <Box flexGrow={1}>
                    <Typography variant="h6" gutterBottom>Start a new meeting</Typography>
                    
                    <Box mt={2} mb={3}>
                      <Button
                        fullWidth
                        variant="outlined"
                        size="large"
                        startIcon={<VideoCallIcon color="primary" />}
                        onClick={() => {
                          setMeetingType('instant');
                          setCreateMeetingDialogOpen(true);
                        }}
                        sx={{
                          py: 2,
                          mb: 2,
                          borderStyle: 'dashed',
                          borderWidth: 1.5,
                          '&:hover': {
                            borderWidth: 1.5,
                            borderStyle: 'dashed',
                            backgroundColor: 'action.hover',
                          },
                        }}
                      >
                        <Box textAlign="left">
                          <Typography variant="subtitle1" color="primary">
                            Start an instant meeting
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            Start a meeting right away
                          </Typography>
                        </Box>
                      </Button>
                      
                      <Button
                        fullWidth
                        variant="outlined"
                        size="large"
                        startIcon={<ScheduleIcon color="primary" />}
                        onClick={() => {
                          setMeetingType('scheduled');
                          setCreateMeetingDialogOpen(true);
                        }}
                        sx={{
                          py: 2,
                          borderStyle: 'dashed',
                          borderWidth: 1.5,
                          '&:hover': {
                            borderWidth: 1.5,
                            borderStyle: 'dashed',
                            backgroundColor: 'action.hover',
                          },
                        }}
                      >
                        <Box textAlign="left">
                          <Typography variant="subtitle1" color="primary">
                            Schedule for later
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            Set a date and time for your meeting
                          </Typography>
                        </Box>
                      </Button>
                    </Box>
                    
                    <Divider sx={{ my: 2 }}>or</Divider>
                    
                    <Box mt={3}>
                      <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                        Start with these options
                      </Typography>
                      <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
                        <Tooltip title="Start with video off">
                          <Chip 
                            icon={<VideocamOffIcon fontSize="small" />} 
                            label="Video off" 
                            variant="outlined"
                            size="small"
                            onClick={() => {
                              setSettings(prev => ({
                                ...prev,
                                videoOnJoin: false
                              }));
                              setMeetingType('instant');
                              setCreateMeetingDialogOpen(true);
                            }}
                            sx={{ cursor: 'pointer' }}
                          />
                        </Tooltip>
                        
                        <Tooltip title="Start with microphone muted">
                          <Chip 
                            icon={<MicOffIcon fontSize="small" />} 
                            label="Mute mic" 
                            variant="outlined"
                            size="small"
                            onClick={() => {
                              setSettings(prev => ({
                                ...prev,
                                audioOnJoin: false
                              }));
                              setMeetingType('instant');
                              setCreateMeetingDialogOpen(true);
                            }}
                            sx={{ cursor: 'pointer' }}
                          />
                        </Tooltip>
                        
                        <Tooltip title="Start with screen sharing">
                          <Chip 
                            icon={<ScreenShareIcon fontSize="small" />} 
                            label="Share screen" 
                            variant="outlined"
                            size="small"
                            onClick={() => {
                              setSettings(prev => ({
                                ...prev,
                                enableScreenSharing: true
                              }));
                              setMeetingType('instant');
                              setCreateMeetingDialogOpen(true);
                            }}
                            sx={{ cursor: 'pointer' }}
                          />
                        </Tooltip>
                      </Box>
                    </Box>
                  </Box>
                  
                  <Box mt="auto">
                    <Typography variant="caption" color="textSecondary">
                      By joining, you agree to our Terms of Service and Privacy Policy.
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Paper elevation={3} sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h6" gutterBottom>Join a meeting</Typography>
                  
                  <Box flexGrow={1}>
                    <TextField
                      fullWidth
                      label="Meeting code or link"
                      variant="outlined"
                      value={meetingCode}
                      onChange={(e) => setMeetingCode(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleJoinMeeting()}
                      placeholder="Enter code or paste link"
                      margin="normal"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <MeetingRoomIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                    
                    <Collapse in={!!meetingCode.trim()}>
                      <Box mt={2}>
                        <TextField
                          fullWidth
                          label="Your name"
                          variant="outlined"
                          value={user?.name || ''}
                          onChange={(e) => {
                            // Update user name in context if needed
                          }}
                          placeholder="Enter your name"
                          margin="normal"
                        />
                        
                        <TextField
                          fullWidth
                          label="Password (if required)"
                          type="password"
                          variant="outlined"
                          value={meetingPassword}
                          onChange={(e) => setMeetingPassword(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleJoinMeeting()}
                          placeholder="Enter password"
                          margin="normal"
                        />
                        
                        <FormControlLabel
                          control={
                            <Checkbox 
                              checked={settings.audioOnJoin}
                              onChange={(e) => toggleSetting('audioOnJoin')}
                              color="primary"
                            />
                          }
                          label="Turn on microphone"
                          sx={{ mt: 1 }}
                        />
                        
                        <FormControlLabel
                          control={
                            <Checkbox 
                              checked={settings.videoOnJoin}
                              onChange={(e) => toggleSetting('videoOnJoin')}
                              color="primary"
                            />
                          }
                          label="Turn on video"
                        />
                      </Box>
                    </Collapse>
                  </Box>
                  
                  <Box mt={3}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      size="large"
                      startIcon={isJoining ? <CircularProgress size={20} color="inherit" /> : <MeetingRoomIcon />}
                      onClick={handleJoinMeeting}
                      disabled={isJoining || !meetingCode.trim()}
                      sx={{ 
                        py: 1.5,
                        fontSize: '1rem',
                        fontWeight: 500,
                        borderRadius: '8px',
                        textTransform: 'none'
                      }}
                    >
                      {isJoining ? 'Joining...' : 'Join now'}
                    </Button>
                    
                    <Divider sx={{ my: 3 }}>
                      <Typography variant="caption" color="textSecondary">OR</Typography>
                    </Divider>
                    
                    <Box textAlign="center">
                      <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                        Don't have a meeting ID?
                      </Typography>
                      <Button
                        variant="text"
                        color="primary"
                        onClick={() => {
                          setMeetingType('instant');
                          setCreateMeetingDialogOpen(true);
                        }}
                        startIcon={<VideoCallIcon />}
                        sx={{
                          textTransform: 'none',
                          fontWeight: 500
                        }}
                      >
                        Start a new meeting
                      </Button>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          )}
          
          {tabValue === 1 && (
            <Paper elevation={3} sx={{ p: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6">Upcoming Meetings</Typography>
                <Button 
                  variant="outlined" 
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={() => setTabValue(0)}
                >
                  New Meeting
                </Button>
              </Box>
              
              {isLoadingMeetings ? (
                <Box textAlign="center" py={4}>
                  <CircularProgress />
                  <Typography variant="body2" color="textSecondary" mt={2}>
                    Loading meetings...
                  </Typography>
                </Box>
              ) : upcomingMeetings.length > 0 ? (
                <List>
                  {upcomingMeetings.map((meeting) => (
                    <React.Fragment key={meeting._id}>
                      <ListItem 
                        button 
                        onClick={() => navigate(`/meeting/${meeting.roomName}`)}
                        sx={{
                          '&:hover': {
                            backgroundColor: 'action.hover',
                            borderRadius: 1,
                          },
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar>
                            <MeetingRoomIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <MuiListItemText
                          primary={meeting.title || 'Untitled Meeting'}
                          secondary={`Starts at ${formatDate(meeting.startTime)}`}
                        />
                        <ListItemSecondaryAction>
                          <Box display="flex" alignItems="center">
                            <Chip 
                              label="Upcoming" 
                              color="primary" 
                              variant="outlined" 
                              size="small"
                              sx={{ mr: 1 }}
                            />
                            <IconButton 
                              edge="end" 
                              aria-label="copy"
                              onClick={(e) => {
                                e.stopPropagation();
                                copyToClipboard(`${window.location.origin}/meeting/${meeting.roomName}`);
                              }}
                            >
                              <ContentCopyIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </ListItemSecondaryAction>
                      </ListItem>
                      <Divider variant="inset" component="li" />
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Box textAlign="center" py={4}>
                  <Typography variant="body1" color="textSecondary">
                    No upcoming meetings scheduled.
                  </Typography>
                  <Button 
                    variant="text" 
                    color="primary"
                    onClick={() => setTabValue(0)}
                    startIcon={<AddIcon />}
                    sx={{ mt: 2 }}
                  >
                    Schedule a meeting
                  </Button>
                </Box>
              )}
            </Paper>
          )}
          
          {tabValue === 2 && (
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Past Meetings</Typography>
              
              {isLoadingMeetings ? (
                <Box textAlign="center" py={4}>
                  <CircularProgress />
                  <Typography variant="body2" color="textSecondary" mt={2}>
                    Loading meetings...
                  </Typography>
                </Box>
              ) : pastMeetings.length > 0 ? (
                <List>
                  {pastMeetings.map((meeting) => (
                    <React.Fragment key={meeting._id}>
                      <ListItem 
                        sx={{
                          '&:hover': {
                            backgroundColor: 'action.hover',
                            borderRadius: 1,
                          },
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar>
                            <MeetingRoomIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <MuiListItemText
                          primary={meeting.title || 'Untitled Meeting'}
                          secondary={`Ended at ${formatDate(meeting.endTime || meeting.updatedAt)}`}
                        />
                        <ListItemSecondaryAction>
                          <Chip 
                            label="Ended" 
                            color="default" 
                            variant="outlined" 
                            size="small"
                            icon={<CancelIcon fontSize="small" />}
                          />
                        </ListItemSecondaryAction>
                      </ListItem>
                      <Divider variant="inset" component="li" />
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Box textAlign="center" py={4}>
                  <Typography variant="body1" color="textSecondary">
                    No past meetings found.
                  </Typography>
                </Box>
              )}
            </Paper>
          )}
        </Box>
        
        {/* Features Section */}
        <Box my={8}>
          <Typography variant="h4" align="center" gutterBottom>
            Everything you need for productive meetings
          </Typography>
          <Typography variant="subtitle1" align="center" color="textSecondary" paragraph>
            High-quality video meetings with powerful features for collaboration
          </Typography>
          
          <Grid container spacing={4} mt={2}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <FeatureCard>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box textAlign="center" mb={2}>
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" align="center" gutterBottom>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" align="center">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </FeatureCard>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
      
      {/* Dialogs */}
      {renderCreateMeetingDialog()}
      {renderMeetingLinkDialog()}
      {renderSettingsMenu()}
      
      {/* Backdrop for loading */}
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isCreating || isJoining}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
};

export default MeetingHome;