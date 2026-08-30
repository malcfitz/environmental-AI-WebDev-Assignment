using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AspNetCoreMvcWebSite.Data;
using AspNetCoreMvcWebSite.Models;
using Microsoft.AspNetCore.Authorization;

namespace AspNetCoreMvcWebSite.Controllers
{
    public class AIImageController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _env;

        public AIImageController(ApplicationDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        // GET: AIImage
        public async Task<IActionResult> Index()
        {
            // Sort by most liked first
            var images = await _context.AIImages
                .OrderByDescending(i => i.Like)
                .ToListAsync();

            return View(images);
        }

        // GET: AIImage/Delete
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null) return NotFound();

            var aiImage = await _context.AIImages.FirstOrDefaultAsync(m => m.Id == id);
            if (aiImage == null) return NotFound();

            return View(aiImage);
        }


        // GET: AIImage/Create
        [Authorize(Roles = "admin, user")]
        public IActionResult Create() => View();

        // POST: AIImage/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        [Authorize(Roles = "admin, user")]
        public async Task<IActionResult> Create(AIImage aiImage, IFormFile File)
        {
            ModelState.Remove("ImagePath");

            if (ModelState.IsValid)
            {
                if (File != null && File.Length > 0)
                {
                    var uploadsFolder = Path.Combine(_env.WebRootPath, "uploads");
                    if (!Directory.Exists(uploadsFolder))
                        Directory.CreateDirectory(uploadsFolder);

                    var uniqueFileName = Guid.NewGuid().ToString() + Path.GetExtension(File.FileName);
                    var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await File.CopyToAsync(stream);
                    }

                    aiImage.ImagePath = "/uploads/" + uniqueFileName;
                }
                else
                {
                    ModelState.AddModelError("File", "Please upload an image.");
                    return View(aiImage);
                }

                aiImage.UploadDate = DateTime.Now;
                aiImage.Like = 0;

                _context.Add(aiImage);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }

            return View(aiImage);
        }

        // GET: AIImage/Edit
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null) return NotFound();

            var aiImage = await _context.AIImages.FindAsync(id);
            if (aiImage == null) return NotFound();

            return View(aiImage);
        }

        // POST: AIImage/Edit
        [HttpPost]
        [ValidateAntiForgeryToken]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Edit(int id, [Bind("Id,Prompt,ImageGenerator")] AIImage model, IFormFile? File)
        {
            if (id != model.Id) return NotFound();

            var existingImage = await _context.AIImages.FindAsync(id);
            if (existingImage == null) return NotFound();

            if (ModelState.IsValid)
            {
                // Update properties
                existingImage.Prompt = model.Prompt;
                existingImage.ImageGenerator = model.ImageGenerator;

                // Handle file upload
                if (File != null && File.Length > 0)
                {
                    var uploadsFolder = Path.Combine(_env.WebRootPath, "uploads");
                    if (!Directory.Exists(uploadsFolder))
                        Directory.CreateDirectory(uploadsFolder);

                    var uniqueFileName = Guid.NewGuid().ToString() + Path.GetExtension(File.FileName);
                    var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                    using var stream = new FileStream(filePath, FileMode.Create);
                    await File.CopyToAsync(stream);

                    existingImage.ImagePath = "/uploads/" + uniqueFileName;
                }

                try
                {
                    _context.Update(existingImage);
                    await _context.SaveChangesAsync();
                }
                catch (Exception ex)
                {
                    Console.WriteLine("ERROR: " + ex.Message);
                }

                return RedirectToAction(nameof(Index));
            }

            // Debug: log model errors if invalid
            foreach (var error in ModelState.Values.SelectMany(v => v.Errors))
            {
                Console.WriteLine("Model error: " + error.ErrorMessage);
            }

            return View(existingImage);
        }

        // POST: AIImage/Delete
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var aiImage = await _context.AIImages.FindAsync(id);
            if (aiImage != null) _context.AIImages.Remove(aiImage);

            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        // POST: AIImage/IncreaseLike
[HttpPost]
        public async Task<IActionResult> IncreaseLike(int? id)
        {
            if (id == null) return Json(new { success = false });

            var aiImage = await _context.AIImages.FindAsync(id);
            if (aiImage == null) return Json(new { success = false });

            aiImage.Like++;
            await _context.SaveChangesAsync();

            return Json(new { success = true, newLikeCount = aiImage.Like });
        }

        private bool AIImageExists(int id)
        {
            return _context.AIImages.Any(e => e.Id == id);
        }

    }
}
