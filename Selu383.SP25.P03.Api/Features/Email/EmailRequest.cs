﻿namespace Selu383.SP25.P03.Api.Features.Email
{
    public class EmailRequest
    {
        public string RecipientEmail { get; set; } = string.Empty;
        public string Subject { get; set; } = string.Empty;
        public string TextBody { get; set; } = string.Empty;
    }
}
