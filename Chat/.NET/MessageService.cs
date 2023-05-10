    public class MessageService : IMessageService
    {
        IDataProvider _data = null;
        IBaseUserMapper _userMapper = null;

        public readonly ConcurrentDictionary<int, string> _connectUsers = new ConcurrentDictionary<int, string>();
        public MessageService(IDataProvider data, IBaseUserMapper userMapper)
        {
            _data = data;
            _userMapper = userMapper;
        }

        public Task<string> UserConnected(int userId, string connectionId)
        {
            _connectUsers.AddOrUpdate(userId, connectionId, (userId, connectionId) =>
            {
                return connectionId;
            });
            return Task.FromResult(connectionId);
        }


        #region - ADD/UPDATE/DELETE -
        public int Add(MessageAddRequest model, int senderId)
        {
            int id = 0;

            string procName = "[dbo].[Messages_Insert]";

            _data.ExecuteNonQuery(procName
                , inputParamMapper: delegate (SqlParameterCollection parameters)
                {
                    AddCommonParams(model, parameters, senderId);

                    SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                    idOut.Direction = ParameterDirection.Output;
                    parameters.Add(idOut);

                }
                , returnParameters: delegate (SqlParameterCollection returnCollection)
                {
                    object objectId = returnCollection["@Id"].Value;
                    int.TryParse(objectId.ToString(), out id);
                });
            return id;
        }

        public void Update(MessageUpdateRequest model, int senderId)
        {
            string procName = "[dbo].[Messages_Update]";

            _data.ExecuteNonQuery(procName
                , inputParamMapper: delegate (SqlParameterCollection parameters)
                {
                    AddCommonParams(model, parameters, senderId);
                    parameters.AddWithValue("@Id", model.Id);
                }
                , returnParameters: null);
        }

        public void Delete(int id)
        {
            string procName = "[dbo].[Messages_Delete_ById]";

            _data.ExecuteNonQuery(procName
                , inputParamMapper: delegate (SqlParameterCollection parameters)
                {
                    parameters.AddWithValue("@Id", id);
                }
                , returnParameters: null);
        }
        #endregion

        #region - GETS -
        public Paged<MessageDetails> GetByCreatedBy(int senderId, int pageIndex, int pageSize)
        {
            string procName = "[dbo].[Messages_Select_ByCreatedBy]";
            Paged<MessageDetails> pagedList = null;
            List<MessageDetails> list = null;
            int totalCount = 0;

            _data.ExecuteCmd(procName
                , inputParamMapper: delegate (SqlParameterCollection parameters)
                {
                    parameters.AddWithValue("@SenderId", senderId);
                    AddPageParams(pageIndex, pageSize, parameters);
                }
                , singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    int startingIndex = 0;
                    MessageDetails message = MapSingleMessage(reader, ref startingIndex);
                    totalCount = reader.GetSafeInt32(startingIndex++);

                    if (list == null)
                    {
                        list = new List<MessageDetails>();
                    }
                    list.Add(message);
                });
            if (list != null)
            {
                pagedList = new Paged<MessageDetails>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;
        }

        public Paged<MessageDetails> GetByRece(int recipientId, int pageIndex, int pageSize)
        {
            string procName = "[dbo].[Messages_Select_ByRece]";
            Paged<MessageDetails> pagedList = null;
            List<MessageDetails> list = null;
            int totalCount = 0;

            _data.ExecuteCmd(procName
                , inputParamMapper: delegate (SqlParameterCollection parameters)
                {
                    parameters.AddWithValue("@RecipientId", recipientId);
                    AddPageParams(pageIndex, pageSize, parameters);
                }
                , singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    int startingIndex = 0;
                    MessageDetails message = MapSingleMessage(reader, ref startingIndex);
                    totalCount = reader.GetSafeInt32(startingIndex++);

                    if (list == null)
                    {
                        list = new List<MessageDetails>();
                    }
                    list.Add(message);
                });
            if (list != null)
            {
                pagedList = new Paged<MessageDetails>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;
        }

        public Paged<MessageDetails> GetAll(int pageIndex, int pageSize)
        {
            string procName = "[dbo].[Messages_SelectAll]";
            Paged<MessageDetails> pagedList = null;
            List<MessageDetails> list = null;
            int totalCount = 0;

            _data.ExecuteCmd(procName
                , inputParamMapper: delegate (SqlParameterCollection parameters)
                {
                    AddPageParams(pageIndex, pageSize, parameters);
                }
                , singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    int startingIndex = 0;
                    MessageDetails message = MapSingleMessage(reader, ref startingIndex);
                    totalCount = reader.GetSafeInt32(startingIndex++);

                    if (list == null)
                    {
                        list = new List<MessageDetails>();
                    }
                    list.Add(message);
                });
            if (list != null)
            {
                pagedList = new Paged<MessageDetails>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;
        }

        public MessageDetails GetById(int id)
        {
            string procName = "[dbo].[Messages_Select_ById]";
            MessageDetails message = null;

            _data.ExecuteCmd(procName
                , inputParamMapper: delegate (SqlParameterCollection parameters)
                {
                    parameters.AddWithValue("@Id", id);
                }
                , singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    int startingIndex = 0;
                    message = MapSingleMessage(reader, ref startingIndex);
                });
            return message;
        }

        public List<MessageDetails> GetByUsers(int firstUserId, int secondUserId)
        {
            string procName = "[dbo].[Messages_Select_ByUsers]";
            List<MessageDetails> list = null;

            _data.ExecuteCmd(procName
                , inputParamMapper: delegate (SqlParameterCollection parameters)
                {
                    parameters.AddWithValue("@FirstUserId", firstUserId);
                    parameters.AddWithValue("@SecondUserId", secondUserId);
                }
                , singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    int startingIndex = 0;
                    MessageDetails message = MapSingleMessage(reader, ref startingIndex);

                    if (list == null)
                    {
                        list = new List<MessageDetails>();
                    }
                    list.Add(message);
                });
            return list;
        }

        public List<UniqueChatContact> GetUniqueByUserId(int userId)
        {
            string procName = "[dbo].[Messages_Select_UniqueByUserId]";
            List<UniqueChatContact> list = null;

            _data.ExecuteCmd(procName
                , inputParamMapper: delegate (SqlParameterCollection parameters)
                {
                    parameters.AddWithValue("@UserId", userId);
                }
                , singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    int startingIndex = 0;
                    UniqueChatContact message = MapUniqueChatContact(reader, ref startingIndex);

                    if (list == null)
                    {
                        list = new List<UniqueChatContact>();
                    }
                    list.Add(message);
                });
            return list;
        }
        #endregion

        #region - PRIVATE -
        private static void AddCommonParams(MessageAddRequest model, SqlParameterCollection parameters, int userId)
        {
            parameters.AddWithValue("@Message", model.Message);
            parameters.AddWithValue("@Subject", model.Subject);
            parameters.AddWithValue("@RecipientId", model.RecipientId);
            parameters.AddWithValue("@SenderId", userId);
            parameters.AddWithValue("@DateSent", model.DateSent);
            parameters.AddWithValue("@DateRead", model.DateRead);
        }

        private static void AddPageParams(int pageIndex, int pageSize, SqlParameterCollection parameters)
        {
            parameters.AddWithValue("@PageIndex", pageIndex);
            parameters.AddWithValue("@PageSize", pageSize);
        }

        public MessageDetails MapSingleMessage(IDataReader reader, ref int startingIndex)
        {
            MessageDetails message = new MessageDetails();

            message = new MessageDetails();
            message.Id = reader.GetSafeInt32(startingIndex++);
            message.Message = reader.GetSafeString(startingIndex++);
            message.Subject = reader.GetSafeString(startingIndex++);
            message.Recipient = _userMapper.MapUser(reader, ref startingIndex);
            message.Sender = _userMapper.MapUser(reader, ref startingIndex);
            message.DateSent = reader.GetSafeDateTime(startingIndex++);
            message.DateRead = reader.GetSafeDateTime(startingIndex++);
            message.DateModified = reader.GetSafeDateTime(startingIndex++);
            message.DateCreated = reader.GetSafeDateTime(startingIndex++);

            return message;
        }

        public UniqueChatContact MapUniqueChatContact(IDataReader reader, ref int startingIndex)
        {
            UniqueChatContact contact = null;

            contact = new UniqueChatContact();
            contact.Id = reader.GetSafeInt32(startingIndex++);
            contact.FirstName = reader.GetSafeString(startingIndex++);
            contact.LastName = reader.GetSafeString(startingIndex++);
            contact.AvatarUrl = reader.GetSafeString(startingIndex++);

            return contact;
        }
        #endregion
    }
