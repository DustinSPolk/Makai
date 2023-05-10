    public interface IMessageService
    {
        int Add(MessageAddRequest model, int userId);
        void Delete(int id);
        Paged<MessageDetails> GetAll(int pageIndex, int pageSize);
        Paged<MessageDetails> GetByCreatedBy(int senderId, int pageIndex, int pageSize);
        MessageDetails GetById(int id);
        Paged<MessageDetails> GetByRece(int recipientId, int pageIndex, int pageSize);
        MessageDetails MapSingleMessage(IDataReader reader, ref int startingIndex);
        void Update(MessageUpdateRequest model, int userId);
        Task<string> UserConnected(int userId, string connectionId);
        List<MessageDetails> GetByUsers(int firstUserId, int secondUserId);
        List<UniqueChatContact> GetUniqueByUserId(int userId);
    }
