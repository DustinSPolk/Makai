using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Domain.Messages
{
    public class MessageDetails
    {
        public int Id { get; set; }
        public string Message { get; set; }
        public string Subject { get; set; }
        public BaseUser Recipient { get; set; }
        public BaseUser Sender { get; set; }
        public DateTime DateSent { get; set; }
        public DateTime DateRead { get; set; }
        public DateTime DateModified { get; set; }
        public DateTime DateCreated { get; set; }
    }
}
