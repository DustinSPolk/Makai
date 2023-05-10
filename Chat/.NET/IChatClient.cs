    public interface IChatClient
    {
        Task ReceiveMessage(MessageAddRequest model, int userId, int msgId);
        Task OnConnectedAsync();
        Task OnDisconnectedAsync(Exception ex);
        Task OnReconnectedAsync();
    }
