import { useCallback, useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "../../Context/UserContext";

export default function ChatPage() {
  const [isChatAreaVisible, setChatAreaVisible] = useState(false);
  const [users, setUsers] = useState([]);
  const { user } = useContext(UserContext)
  const [threads, setThreads] = useState([]);
  const [message, setMessage] = useState('');
  const [threadIndex, setThreadIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const getThreads = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:4000/chat", { withCredentials: true });
      setUsers(res.data.users);
      setThreads(res.data.threads);
    } catch (err) {
      console.log(err);
    }
  }, [])

  const sendMessage = async (e) => {
    e.preventDefault();
    try {
      if (!message) return;
      const res = await axios.post(`http://localhost:4000/chat/${threads[threadIndex]._id}`, { content: message }, { withCredentials: true });
      setThreads(threads.map((thread, i) => (
        i === threadIndex
          ? { ...thread, content: [...thread.content, res.data.message] }
          : thread
      )))
      setMessage('');
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getThreads();
  }, [getThreads])

  useEffect(() => {
    if (threads.length === 0) return;
    const threadId = localStorage.getItem("threadId");
    threadId && setThreadIndex(threads.findIndex(thread => thread._id === threadId))
    localStorage.removeItem("threadId");
  }, [threads])

  const toggleChatArea = (i) => {
    i !== null && setThreadIndex(i)
    if (window.innerWidth < 768) {
      setChatAreaVisible(!isChatAreaVisible);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setChatAreaVisible(false);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  if (!user) {
    return null;
  }

  return (
    <section>
      {/* Component */}
      <div className="flex">
        {/* <!-- Sidebar --> */}
        <div
          className={`sidebar ${isChatAreaVisible ? "hidden" : ""
            } w-full md:w-1/4 bg-white border-r border-gray-300`}
        >
          {/* <!-- Sidebar Header --> */}
          <header className="p-4 border-b border-gray-300 flex flex-col bg-[#FAC800] text-white">
            <h1 className="text-2xl font-semibold mb-3">Chat</h1>
            <label
              for="default-search"
              className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
            >
              Search
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                type="search"
                id="default-search"
                className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </header>

          {/* <!-- Contact List --> */}
          <div className="contactList overflow-y-auto h-screen px-3 pt-3 mb-9 pb-72 bg-[#FFFFFF]">
            <ContactList users={users} searchTerm={searchTerm} toggleChatArea={toggleChatArea} threadIndex={threadIndex} />
          </div>
        </div >

        {/* <!-- Main Chat Area --> */}
        <div
          className={`mainChatArea flex-1 ${isChatAreaVisible ? "block" : "hidden"
            } md:block`}
        >
          <div className="flex flex-col"></div>
          {/* <!-- Chat Header --> */}
          <div div className="p-4 flex justify-start items-center text-2xl font-semibold" >
            <button
              className="backButton md:hidden pe-5"
              onClick={() => toggleChatArea(null)}
            >
              <i className="fa-solid fa-arrow-left"></i>
            </button>
            <div className="bg-gray-300 rounded-full mr-3">
              {users[threadIndex] && users[threadIndex].img ? <img className="inline-block xl:w-10 xl:h-10 lg:w-10 lg:h-10 md:w-8 md:h-8 sm:w-8 sm:h-8 xs:w-5 xs:h-5 rounded-full object-fit ring-2 ring-white"
                src={`data:image/jpeg;base64,${users[threadIndex].img}`}
                alt="avatar_img" /> : <div class="relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                <svg class="absolute w-12 h-12 text-gray-400 -left-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>
              </div>}
            </div>
            <div>
              <header className="text-gray-700">
                <h1>{users[threadIndex] && (users[threadIndex].businessName || users[threadIndex].name)}</h1>
              </header>
            </div>
          </div>

          {/* <!-- Chat Messages --> */}
          <div className="h-screen overflow-y-auto p-4 pb-72 bg-[#E3E5E0]">
            {/* <!-- Incoming Message --> */}
            {threads[threadIndex] && threads[threadIndex].content.map((message) => {
              if (user && message.sender === user.role) {
                return (
                  <div className="flex justify-end mb-4 cursor-pointer">
                    <div className="flex max-w-96 bg-[#000054] text-white rounded-lg p-3 gap-3">
                      <p>
                        {message.content}
                      </p>
                    </div>
                  </div>
                )
              } else {
                return (
                  <div className="flex mb-4 cursor-pointer">
                    <div className="flex max-w-96 bg-[#FFFFFF] rounded-lg p-3 gap-3">
                      <p className="text-gray-700">{message.content}</p>
                    </div>
                  </div>
                )
              }
            })}
          </div>
          {/* <!-- Chat Input --> */}
          <footer className="bg-white border-t border-gray-300 p-4 absolute bottom-0 md:w-3/4 w-full">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage(e);
              }}
              className="flex items-center"
            >
              <input
                type="text"
                placeholder="Type a message..."
                className="w-full p-2 rounded-md border border-gray-400 focus:outline-none"
                onChange={(e) => setMessage(e.target.value)}
                value={message}
              />
              <button type="submit" className="bg-[#FAC800] text-white px-4 py-2 rounded-md ml-2 font-semibold">
                Send
              </button>
            </form>
          </footer>
        </div>
      </div>
    </section >
  );
}

function filterUsers(users, searchTerm) {
  const regex = new RegExp(searchTerm, 'i');
  return users.filter(user => regex.test(user.businessName || user.name));
}

function ContactList({ users, searchTerm, toggleChatArea, threadIndex }) {
  const [dataSlice, setDataSlice] = useState(users);
  useEffect(() => {
    searchTerm && setDataSlice(filterUsers(users, searchTerm))
    !searchTerm && setDataSlice(users)
  }, [searchTerm, users])

  return (
    dataSlice.map((user, i) => (
      <div
        className={(i === threadIndex ? "bg-gray-100" : "") + " flex items-center mb-4 cursor-pointer hover:bg-gray-100 p-2 rounded-md"}
        onClick={() => toggleChatArea(i)}
      >
        {user.img ? <img className="inline-block xl:w-10 xl:h-10 lg:w-10 lg:h-10 md:w-8 md:h-8 sm:w-8 sm:h-8 xs:w-5 xs:h-5 rounded-full object-fit ring-2 ring-white"
          src={`data:image/jpeg;base64,${user.img}`}
          alt="avatar_img" /> : <div class="relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
          <svg class="absolute w-12 h-12 text-gray-400 -left-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>
        </div>}
        <div className="ml-3 flex-1 truncate ...">
          <h2 className="text-lg font-semibold">{user.businessName || user.name}</h2>
        </div>
      </div>
    ))
  )
}