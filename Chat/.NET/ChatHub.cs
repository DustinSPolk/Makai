using Microsoft.AspNetCore.SignalR;
using Sabio.Services.Interfaces;
using Sabio.Services;
using System.Threading.Tasks;


namespace Sabio.Web.Api.Hubs
{
    public class ChatHub : Hub<IChatClient>
    {
        private IMessageService _messageService = null;
        private IAuthenticationService<int> _authService = null;

        public ChatHub(IMessageService service
            , IAuthenticationService<int> authService)
        {
            _messageService = service;
            _authService = authService;
        }

        public override async Task OnConnectedAsync()
        {
            await _messageService.UserConnected(_authService.GetCurrentUserId(), Context.ConnectionId);
            await base.OnConnectedAsync();
        }

    }

}
