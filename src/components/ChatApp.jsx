import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useAuth } from "../hooks/useAuth";
import ChatArea from './ChatArea';
import { useLottie } from "lottie-react";
import ContactLoader from "../animation/ContactLoader.json";
import useSWR from 'swr';
import { useNavigate, useParams } from 'react-router-dom';

const fetcher = (...args) => fetch(...args).then(res => res.json())

const ChatApp = ({}) => {
  const [selectedUser,setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { patientId } = useParams();
  const {user} = useAuth();
  const navigate = useNavigate();
  const { data, error, isLoading } = useSWR(`${import.meta.env.VITE_BACKEND_URL}/users/get-patients/${user?.id}`, fetcher);

  useEffect(() => {
    if (data?.data?.patients?.length) {
      if (patientId) {
        const foundPatient = data.data.patients.find(patient => patient.id === patientId);
        setSelectedUser(foundPatient || data.data.patients[0]);
      } else {
        setSelectedUser(data.data.patients[0]);
      }
    }
  }, [data, patientId]);

  useEffect(()=>{
    if(selectedUser){
      navigate(`/chat/${selectedUser.id}`);
    }
    else {
      navigate(`/chat`);
    }
  },[selectedUser])

  const filteredPatients = data?.data?.patients?.filter((patient) =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };
  
  const options = {
    animationData: ContactLoader,
    loop: true
  };
  const { View } = useLottie(options);
  
  return (
    <div className="flex h-screen bg-white ml-64">
      {/* Left sidebar */}
      <div className="w-80 bg-primary border-r flex flex-col">
        {/* Search bar with icon */}
        <div className="p-4">
          <div className=" rounded-full p-2 flex items-center border border-black">
            <svg className="w-5 h-5 text-gray-600 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              className="bg-transparent w-full outline-none px-2"
              placeholder="Search..."
              onChange={handleSearch}
              disabled={isLoading || !data?.data?.patients?.length}
            />
          </div>
        </div>
        {/* Contacts list - using native scroll */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 ">
          {isLoading && <div className="flex justify-center items-center h-full" >{View}</div> }
          {!isLoading && data && data.data && !data.data.patients.length && <div>No Patients.</div> }
          {!isLoading && data && data.data && filteredPatients.map((contact,index) => (
            <div key={index} className="p-4 bg-white hover:bg-gray-50 cursor-pointer rounded-xl mt-2" onClick={() =>setSelectedUser(contact)}>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img
                    src="/assets/Logo.png"
                    alt={contact.name}
                    className="w-10 h-10 rounded-full"
                  />
                  {/* {contact.name && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )} */}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">{contact.name}</h3>
                    {/* <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg> */}
                  </div>
                  <p className="text-sm text-gray-500 truncate">{contact.email}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat area */}
      {selectedUser && <ChatArea selectedUser={selectedUser} />}
    </div>
  );
};

export default ChatApp;