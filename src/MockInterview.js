import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Mic, MicOff, Video, VideoOff, Share, MoreVertical, Users, MessageSquare, Smile, FileText, Maximize2, Send, User, X } from 'lucide-react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

// MockInterview component: Simulates a one-on-one interview experience with an AI interviewer
// Recent changes:
// 1. Simplified interface to focus on a one-on-one interaction:
//    - Removed all participants except for the AI interviewer (Pally Bot) and the user
//    - Updated video containers to display only two participants side by side
//    - Eliminated unnecessary UI elements to reduce distractions
// 2. Improved user experience and layout:
//    - Relocated control elements (mute, video, etc.) to the top of the interface
//    - Implemented a horizontal control bar for easy access to essential functions
//    - This new layout mimics popular video conferencing tools for familiarity and ease of use
//    - Enhanced visibility and accessibility of control buttons
// 3. Enhanced interview simulation:
//    - Integrated speech recognition for transcribing user responses in real-time
//    - Implemented a chat interface for text-based communication as an alternative
//    - Added a series of predefined interview questions for a structured experience
//    - Improved the flow of conversation between the AI interviewer and the user
// 4. Responsive design:
//    - Ensured the layout adapts well to different screen sizes for better accessibility
//    - Optimized video container sizes for various device dimensions

const MockInterview = () => {
  const [conversation, setConversation] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const videoRef = useRef(null);

  const interviewQuestions = useMemo(() => [
    "Tell me about yourself.",
    "What are your greatest strengths?",
    "What do you consider to be your weaknesses?",
    "Why do you want this job?",
    "Where do you see yourself in five years?",
    "Why should we hire you?",
    "Do you have any questions for us?",
  ], []);

  const {
    transcript,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  useEffect(() => {
    if (isCameraOn) {
      startCamera();
    } else {
      stopCamera();
    }
  }, [isCameraOn]);

  useEffect(() => {
    if (transcript) {
      setUserInput(transcript);
    }
  }, [transcript]);

  useEffect(() => {
    // Start the interview with the first question
    if (conversation.length === 0) {
      setConversation([{ speaker: 'bot', text: `Pally Bot: ${interviewQuestions[0]}` }]);
    }
  }, [conversation.length, interviewQuestions]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const toggleCamera = () => {
    setIsCameraOn(!isCameraOn);
  };

  const toggleListening = () => {
    if (isListening) {
      SpeechRecognition.stopListening();
    } else {
      SpeechRecognition.startListening({ continuous: true });
    }
    setIsListening(!isListening);
  };

  const handleSendMessage = () => {
    if (userInput.trim() !== '') {
      setConversation([...conversation, { speaker: 'user', text: userInput }]);
      setUserInput('');
      resetTranscript();

      // Move to the next question
      const nextQuestionIndex = currentQuestionIndex + 1;
      if (nextQuestionIndex < interviewQuestions.length) {
        setTimeout(() => {
          setConversation(prev => [...prev, { speaker: 'bot', text: `Pally Bot: ${interviewQuestions[nextQuestionIndex]}` }]);
          setCurrentQuestionIndex(nextQuestionIndex);
        }, 1000);
      } else {
        setTimeout(() => {
          setConversation(prev => [...prev, { speaker: 'bot', text: "Pally Bot: Thank you for your time. Do you have any questions for me?" }]);
        }, 1000);
      }
    }
  };

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  return (
    <div className="App flex flex-col h-screen bg-[#1E1E1E] text-white">
      {/* Control bar */}
      <div className="control-bar fixed top-0 left-0 right-0 z-50 bg-black bg-opacity-80 flex items-center justify-between px-6 py-4">
        <div className="flex items-center">
          <div className="title text-xl font-bold mr-4">MI 2021</div>
          <div className="timer text-sm font-semibold bg-[#2C2C2C] px-3 py-1 rounded-full">00:01:16</div>
        </div>
        <div className="flex items-center space-x-3">
          <button className={`control-button p-2.5 rounded-full ${isListening ? 'bg-green-600' : 'bg-[#2C2C2C]'} hover:bg-opacity-90 transition-colors duration-200`} onClick={toggleListening} title={isListening ? "Mute" : "Unmute"}>
            {isListening ? <Mic size={18} /> : <MicOff size={18} />}
          </button>
          <button className={`control-button p-2.5 rounded-full ${isCameraOn ? 'bg-green-600' : 'bg-[#2C2C2C]'} hover:bg-opacity-90 transition-colors duration-200`} onClick={toggleCamera} title={isCameraOn ? "Stop Video" : "Start Video"}>
            {isCameraOn ? <Video size={18} /> : <VideoOff size={18} />}
          </button>
          <button className="control-button p-2.5 rounded-full bg-[#2C2C2C] hover:bg-opacity-90 transition-colors duration-200" title="Share Screen">
            <Share size={18} />
          </button>
          <button className="control-button p-2.5 rounded-full bg-[#2C2C2C] hover:bg-opacity-90 transition-colors duration-200" title="Participants">
            <Users size={18} />
          </button>
          <button className="control-button p-2.5 rounded-full bg-[#2C2C2C] hover:bg-opacity-90 transition-colors duration-200" title="Chat">
            <MessageSquare size={18} />
          </button>
          <button className="control-button p-2.5 rounded-full bg-[#2C2C2C] hover:bg-opacity-90 transition-colors duration-200" title="Reactions">
            <Smile size={18} />
          </button>
          <button className="control-button p-2.5 rounded-full bg-[#2C2C2C] hover:bg-opacity-90 transition-colors duration-200" title="Notes">
            <FileText size={18} />
          </button>
          <button className="control-button p-2.5 rounded-full bg-[#2C2C2C] hover:bg-opacity-90 transition-colors duration-200" title="More Options">
            <MoreVertical size={18} />
          </button>
          <button className="leave-button bg-[#E74C3C] hover:bg-[#C0392B] text-white p-2.5 rounded-full ml-3 transition-colors duration-200" title="Leave Call">
            <X size={18} />
          </button>
        </div>
      </div>

      <div className="main-content flex flex-1 overflow-hidden relative">
        {/* Video containers */}
        <div className="video-area flex-1 flex justify-center items-center p-4">
          <div className="video-container w-[48%] aspect-video bg-[#1E1E1E] overflow-hidden relative rounded-xl shadow-md mr-2">
            {isCameraOn ? (
              <video ref={videoRef} autoPlay muted className="w-full h-full object-cover" />
            ) : (
              <div className="video-placeholder w-full h-full flex items-center justify-center">
                <User size={128} className="text-gray-500" />
              </div>
            )}
            <div className="absolute top-2 right-2">
              <button className="p-1 bg-black bg-opacity-50 rounded-full hover:bg-opacity-70 transition-colors duration-200">
                <Maximize2 size={16} className="text-white" />
              </button>
            </div>
            <div className="name-tag absolute bottom-4 left-4 bg-black bg-opacity-50 px-3 py-1 rounded-full flex items-center space-x-2">
              <Mic size={14} className={isListening ? "text-green-500" : "text-white"} />
              <span className="text-xs font-semibold">You</span>
            </div>
          </div>
          <div className="video-container w-[48%] aspect-video bg-[#1E1E1E] overflow-hidden relative rounded-xl shadow-md ml-2">
            <div className="video-placeholder w-full h-full flex items-center justify-center">
              <img src={process.env.PUBLIC_URL + '/images/pally-bot-avatar.png'} alt="Pally Bot" className="w-56 h-56 rounded-full object-cover" />
            </div>
            <div className="absolute top-2 right-2">
              <button className="p-1 bg-black bg-opacity-50 rounded-full hover:bg-opacity-70 transition-colors duration-200">
                <Maximize2 size={16} className="text-white" />
              </button>
            </div>
            <div className="name-tag absolute bottom-4 left-4 bg-black bg-opacity-50 px-3 py-1 rounded-full flex items-center space-x-2">
              <Mic size={14} className="text-green-500" />
              <span className="text-xs font-semibold">Pally Bot</span>
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="right-sidebar w-80 bg-[#2C2C2C] border-l border-[#3A3A3A] flex flex-col">
          {/* Chat area */}
          <div className="chat-area flex-1 p-4 flex flex-col">
            <h3 className="text-lg font-semibold mb-4 text-gray-300">Chat</h3>
            {/* Conversation display */}
            <div className="chat-messages flex-1 overflow-y-auto mb-4 p-2 bg-[#3A3A3A] rounded-lg">
              {conversation.map((message, index) => (
                <div key={index} className={`message ${message.speaker === 'user' ? 'user bg-blue-600 ml-auto' : 'bot bg-gray-700'} max-w-[80%] rounded-lg p-2 mb-2`}>
                  <span>{message.text}</span>
                </div>
              ))}
            </div>

            {/* Chat input */}
            <div className="chat-input flex w-full">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1 bg-[#3A3A3A] text-white placeholder-gray-500 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <button
                onClick={handleSendMessage}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-lg transition-colors duration-200 flex items-center"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockInterview;
