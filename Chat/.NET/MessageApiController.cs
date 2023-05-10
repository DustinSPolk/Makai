using Amazon.S3.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Build.Utilities;
using Microsoft.Extensions.Logging;
using Sabio.Models;
using Sabio.Models.Domain.Messages;
using Sabio.Models.Requests.Messages;
using Sabio.Services;
using Sabio.Services.Interfaces;
using Sabio.Web.Api.Hubs;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;
using sib_api_v3_sdk.Model;
using System;
using System.Collections.Generic;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/messages")]
    [ApiController]
    public class MessageApiController : BaseApiController
    {
        private IMessageService _service = null;
        private IAuthenticationService<int> _authService = null;
        private readonly IHubContext<ChatHub, IChatClient> _chatHub = null;

        public MessageApiController(IMessageService service
            ,ILogger<MessageApiController> logger
            ,IHubContext<ChatHub, IChatClient> chatHub
            ,IAuthenticationService<int> authService) : base(logger)
        {
            _service = service;
            _chatHub = chatHub;
            _authService = authService;
        }

        #region - ADD/UPDATE/DELETE -
        [HttpPost]
        public ActionResult<ItemResponse<int>> Add(MessageAddRequest model)
        {
            ObjectResult result = null;

            try
            {
                int senderId = _authService.GetCurrentUserId();
                int id = _service.Add(model, senderId);
                ItemResponse<int> response = new ItemResponse<int> { Item = id };
                result = Created201(response);

                _chatHub.Clients.User(model.RecipientId.ToString()).ReceiveMessage(model, senderId, response.Item);

            }
            catch (Exception ex)
            {
                ErrorResponse response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
                result = StatusCode(500, response);
            }
            return result;
        }

        [HttpPut("{id:int}")]
        public ActionResult<SuccessResponse> Update(MessageUpdateRequest model)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                int senderId = _authService.GetCurrentUserId();
                _service.Update(model, senderId);
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                iCode = 500;
                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(iCode, response);
        }

        [HttpDelete("{id:int}")]
        public ActionResult Delete(int id)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                _service.Delete(id);
                response = new SuccessResponse();
            }
            catch (Exception e)
            {
                iCode = 500;
                response = new ErrorResponse(e.Message);
            }
            return StatusCode(iCode, response);
        }
        #endregion

        #region - GETS -
        [HttpGet("sender/{senderId:int}")]
        public ActionResult<ItemResponse<Paged<MessageDetails>>> GetBySender(int senderId, int pageIndex, int pageSize)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                Paged<MessageDetails> paged = _service.GetByCreatedBy(senderId, pageIndex, pageSize);
                if (paged == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Records not found");
                }
                else
                {
                    response = new ItemResponse<Paged<MessageDetails>> { Item = paged };
                }
            }
            catch (Exception ex)
            {
                iCode = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(iCode, response);
        }

        [HttpGet("recipient/{recipientId:int}")]
        public ActionResult<ItemResponse<Paged<MessageDetails>>> GetByRecipient(int recipientId, int pageIndex, int pageSize)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                Paged<MessageDetails> paged = _service.GetByRece(recipientId, pageIndex, pageSize);
                if (paged == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Records not found");
                }
                else
                {
                    response = new ItemResponse<Paged<MessageDetails>> { Item = paged };
                }
            }
            catch (Exception ex)
            {
                iCode = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(iCode, response);
        }

        [HttpGet]
        public ActionResult<ItemResponse<Paged<MessageDetails>>> GetAll(int pageIndex, int pageSize)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                Paged<MessageDetails> paged = _service.GetAll(pageIndex, pageSize);
                if (paged == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Records not found");
                }
                else
                {
                    response = new ItemResponse<Paged<MessageDetails>> { Item = paged };
                }
            }
            catch (Exception ex)
            {
                iCode = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(iCode, response);
        }

        [HttpGet("{id:int}")]
        public ActionResult<MessageDetails> GetById(int id)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                MessageDetails message = _service.GetById(id);
                if (message == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Records not found");
                }
                else
                {
                    response = new ItemResponse<MessageDetails> { Item = message };
                }
            }
            catch (Exception ex)
            {
                iCode = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(iCode, response);
        }

        [HttpGet("history")]
        public ActionResult<ItemResponse<List<MessageDetails>>> GetByUsers(int firstUserId, int secondUserId)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                List<MessageDetails> list = _service.GetByUsers(firstUserId, secondUserId);
                if (list == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Records not found");
                }
                else
                {
                    response = new ItemResponse<List<MessageDetails>> { Item = list };
                }
            }
            catch (Exception ex)
            {
                iCode = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(iCode, response);
        }

        [HttpGet("unique")]
        public ActionResult<ItemResponse<List<UniqueChatContact>>> GetUniqueByUserId()
        {
            int userId = _authService.GetCurrentUserId();
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                List<UniqueChatContact> list = _service.GetUniqueByUserId(userId);
                if (list == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Records not found");
                }
                else
                {
                    response = new ItemResponse<List<UniqueChatContact>> { Item = list };
                }
            }
            catch (Exception ex)
            {
                iCode = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(iCode, response);
        }
        #endregion
    }
}
