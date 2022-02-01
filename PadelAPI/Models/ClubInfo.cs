using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace PadelScoreboard.Models
{
    public class ClubInfo
    {
        [JsonProperty("id")]
        public Guid Id { get; set; }

        [JsonProperty("naam")]
        public string Naam { get; set; }

        [JsonProperty("logo")]
        public string Logo { get; set; }

        [JsonProperty("straat")]
        public string Straat { get; set; }

        [JsonProperty("stad")]
        public string Stad { get; set; }

        [JsonProperty("beheerder")]
        public string Beheerder { get; set; }

        [JsonProperty("email")]
        public string Email { get; set; }

        [JsonProperty("passwoord")]
        public string Passwoord { get; set; }
    }
}
