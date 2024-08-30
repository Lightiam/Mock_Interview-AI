import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Mic, MicOff, Video, VideoOff, Share, MoreVertical, Users, MessageSquare, Smile, FileText, Maximize2, Send, User, X } from 'lucide-react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

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
    <div className="App flex h-screen bg-[#1E1E1E] text-white">
      {/* Vertical control bar */}
      <div className="control-bar w-20 bg-[#2C2C2C] border-r border-[#3A3A3A] flex flex-col items-center py-4">
        <div className="title text-xl font-bold mb-8">MI 2021</div>
        <div className="timer text-sm font-semibold mb-8">00:01:16</div>
        <button className={`control-button p-2 rounded-full mb-4 ${isListening ? 'bg-green-600' : 'bg-[#3A3A3A]'}`} onClick={toggleListening} title={isListening ? "Mute" : "Unmute"}>
          {isListening ? <Mic size={20} /> : <MicOff size={20} />}
        </button>
        <button className={`control-button p-2 rounded-full mb-4 ${isCameraOn ? 'bg-green-600' : 'bg-[#3A3A3A]'}`} onClick={toggleCamera} title={isCameraOn ? "Stop Video" : "Start Video"}>
          {isCameraOn ? <Video size={20} /> : <VideoOff size={20} />}
        </button>
        <button className="control-button p-2 rounded-full mb-4 bg-[#3A3A3A]" title="Share Screen">
          <Share size={20} />
        </button>
        <button className="control-button p-2 rounded-full mb-4 bg-[#3A3A3A]" title="Participants">
          <Users size={20} />
        </button>
        <button className="control-button p-2 rounded-full mb-4 bg-[#3A3A3A]" title="Chat">
          <MessageSquare size={20} />
        </button>
        <button className="control-button p-2 rounded-full mb-4 bg-[#3A3A3A]" title="Reactions">
          <Smile size={20} />
        </button>
        <button className="control-button p-2 rounded-full mb-4 bg-[#3A3A3A]" title="Notes">
          <FileText size={20} />
        </button>
        <button className="control-button p-2 rounded-full mb-4 bg-[#3A3A3A]" title="More Options">
          <MoreVertical size={20} />
        </button>
        <button className="leave-button bg-[#E74C3C] hover:bg-[#C0392B] text-white p-2 rounded-full mt-auto">
          <X size={20} />
        </button>
      </div>

      {/* Main content area */}
      <div className="main-content flex flex-1 overflow-hidden">
        {/* Video area */}
        <div className="video-area flex-1 flex p-4 gap-4">
          <div className="video-container flex-1 bg-[#2C2C2C] rounded-lg overflow-hidden relative">
            {isCameraOn ? (
              <video ref={videoRef} autoPlay muted className="w-full h-full object-cover" />
            ) : (
              <div className="video-placeholder w-full h-full flex items-center justify-center">
                <User size={64} className="text-gray-400" />
              </div>
            )}
            <div className="absolute top-2 right-2">
              <button className="p-1 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors duration-200">
                <Maximize2 size={16} className="text-white" />
              </button>
            </div>
            <div className="name-tag absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-1 rounded flex items-center space-x-1">
              <Mic size={16} className={isListening ? "text-green-500" : "text-white"} />
              <span>You</span>
            </div>
          </div>
          <div className="video-container flex-1 bg-[#2C2C2C] rounded-lg overflow-hidden relative">
            <div className="video-placeholder w-full h-full flex items-center justify-center">
              <img src={process.env.PUBLIC_URL + '/images/pally-bot-avatar.png'} alt="Pally Bot" className="w-32 h-32 rounded-full object-cover" />
            </div>
            <div className="absolute top-2 right-2">
              <button className="p-1 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors duration-200">
                <Maximize2 size={16} className="text-white" />
              </button>
            </div>
            <div className="name-tag absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-1 rounded flex items-center space-x-1">
              <Mic size={16} className="text-green-500" />
              <span>Pally Bot</span>
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="right-sidebar w-80 bg-[#2C2C2C] border-l border-[#3A3A3A] flex flex-col">
          {/* Participant thumbnails */}
          <div className="participant-thumbnails flex-1 p-4 overflow-y-auto">
            <h3 className="flex items-center text-lg font-semibold mb-4 text-gray-300">
              <Users size={20} className="mr-2" />
              Participants (12)
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {[...Array(12)].map((_, index) => (
                <div key={index} className="participant flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center mb-1">
                    <User size={24} className="text-white" />
                  </div>
                  <span className="text-xs text-gray-300">User {index + 1}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Chat area */}
          <div className="chat-area flex-1 border-t border-[#3A3A3A] p-4 flex flex-col">
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
            <div className="chat-input flex space-x-2">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1 bg-[#3A3A3A] text-white placeholder-gray-500 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <button
                onClick={handleSendMessage}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center"
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
