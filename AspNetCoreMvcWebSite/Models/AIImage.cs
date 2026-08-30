using System;
using System.ComponentModel.DataAnnotations;

namespace AspNetCoreMvcWebSite.Models
{
    public class AIImage
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [Display(Name = "Prompt")]
        public required string Prompt { get; set; }

        [Required]
        [Display(Name = "Image Generator")]
        public required string ImageGenerator { get; set; }

        [Display(Name = "Upload Date")]
        public DateTime UploadDate { get; set; } = DateTime.Now;

        public int Like { get; set; } = 0;

        [Display(Name = "Image Path")]
        public string? ImagePath { get; set; }
    }
}
