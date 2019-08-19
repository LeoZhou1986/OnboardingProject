using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OnboardingTask.Models
{
    public class Message
    {
        public Message(bool success, string msg = null, object data = null)
        {
            this.Success = success;
            this.Msg = msg;
            this.Data = data;
        }

        public bool Success { get; set; }
        public string Msg { get; set; }
        public object Data { get; set; }
    }
}
