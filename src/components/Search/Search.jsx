const Search = () => {
  return (
    <div className='search'>
      <div className="searchForm">
        <input type="text" placeholder='Find a user...' />
      </div>
      <div className="userChat">
        <img src="https://media.licdn.com/dms/image/D4D35AQF0ZhjM6f6yiA/profile-framedphoto-shrink_100_100/0/1694406528498?e=1695304800&v=beta&t=5iTbTTOfBpisV_9IykQC4aUOSYYIQ0o653HKXuWrPwA" alt="" />
        <div className="userChatInfo">
          <span>Randomizer</span>
        </div>
      </div>
    </div>
  )
}

export default Search