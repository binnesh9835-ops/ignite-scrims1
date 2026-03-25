document.addEventListener("DOMContentLoaded", function(){

  console.log("🔥 JS Loaded Successfully");

  /* TAB SELECT */
  const tabs = document.querySelectorAll(".tab");
  const sections = document.querySelectorAll(".section");

  /* SAFETY CHECK */
  if(tabs.length === 0){
    console.log("❌ Tabs not found");
    return;
  }

  /* CLICK EVENT */
  tabs.forEach(btn => {
    btn.addEventListener("click", function(){

      console.log("👉 Clicked:", btn.dataset.tab);

      // remove active
      tabs.forEach(t => t.classList.remove("active"));
      sections.forEach(s => s.classList.remove("active"));

      // add active to clicked
      btn.classList.add("active");

      // show section
      const target = document.getElementById(btn.dataset.tab);

      if(target){
        target.classList.add("active");
      } else {
        console.log("❌ Section not found:", btn.dataset.tab);
      }

    });
  });

});
