using Sabio.Models.Domain.Messages;
using Sabio.Models.Requests.Messages;
using System;
using System.Threading.Tasks;

namespace Sabio.Web.Api.Hubs
{
    public interface IChatClient
    {
        Task ReceiveMessage(MessageAddRequest model, int userId, int msgId);
        Task OnConnectedAsync();
        Task OnDisconnectedAsync(Exception ex);
        Task OnReconnectedAsync();
    }
}
