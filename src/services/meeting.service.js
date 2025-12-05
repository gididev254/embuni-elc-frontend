import axios from 'axios';
import { API_URL } from '../config/config';
import authHeader from './auth-header';

const MEETING_API_URL = `${API_URL}/meetings`;

const meetingService = {
  // Create a new meeting
  createMeeting: async (meetingData) => {
    try {
      const response = await axios.post(MEETING_API_URL, meetingData, { 
        headers: authHeader() 
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get meeting details
  getMeeting: async (roomName) => {
    try {
      const response = await axios.get(`${MEETING_API_URL}/${roomName}`, { 
        headers: authHeader() 
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Join a meeting
  joinMeeting: async (roomName, password) => {
    try {
      const response = await axios.post(
        `${MEETING_API_URL}/${roomName}/join`, 
        { password },
        { headers: authHeader() }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // End a meeting
  endMeeting: async (roomName) => {
    try {
      const response = await axios.put(
        `${MEETING_API_URL}/${roomName}/end`,
        {},
        { headers: authHeader() }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // List meetings
  listMeetings: async (filters = {}) => {
    try {
      const response = await axios.get(MEETING_API_URL, {
        params: filters,
        headers: authHeader()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update meeting
  updateMeeting: async (roomName, updates) => {
    try {
      const response = await axios.put(
        `${MEETING_API_URL}/${roomName}`,
        updates,
        { headers: authHeader() }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete meeting
  deleteMeeting: async (roomName) => {
    try {
      const response = await axios.delete(
        `${MEETING_API_URL}/${roomName}`,
        { headers: authHeader() }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get meeting token
  getMeetingToken: async (roomName) => {
    try {
      const response = await axios.get(
        `${MEETING_API_URL}/${roomName}/token`,
        { headers: authHeader() }
      );
      return response.data.data.token;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get meeting participants
  getMeetingParticipants: async (roomName) => {
    try {
      const response = await axios.get(
        `${MEETING_API_URL}/${roomName}/participants`,
        { headers: authHeader() }
      );
      return response.data.data.participants;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Start recording
  startRecording: async (roomName, streamUrl, filePath) => {
    try {
      const response = await axios.post(
        `${MEETING_API_URL}/${roomName}/recordings/start`,
        { streamUrl, filePath },
        { headers: authHeader() }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Stop recording
  stopRecording: async (roomName, recordingId, fileSize) => {
    try {
      const response = await axios.post(
        `${MEETING_API_URL}/${roomName}/recordings/${recordingId}/stop`,
        { fileSize },
        { headers: authHeader() }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // List recordings
  listRecordings: async (roomName) => {
    try {
      const response = await axios.get(
        `${MEETING_API_URL}/${roomName}/recordings`,
        { headers: authHeader() }
      );
      return response.data.data.recordings;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Handle Jitsi webhook
  handleJitsiWebhook: async (webhookData) => {
    try {
      const response = await axios.post(
        `${MEETING_API_URL}/webhook/jitsi`,
        webhookData,
        { 
          headers: {
            'x-jitsi-webhook-secret': process.env.REACT_APP_JITSI_WEBHOOK_SECRET
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error handling Jitsi webhook:', error);
      throw error.response?.data || error.message;
    }
  }
};

export default meetingService;
