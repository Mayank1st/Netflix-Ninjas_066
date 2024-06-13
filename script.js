/* Navbar section start */




/* Navbar section ends */




/* Expand your horizons section start */



/* Expand your horizons section ends */




/* Section1(We collaborate with ) section start */




/* Section1(We collaborate with ) section ends */




/* Section-2(Launch a new career) section start */




/* Section-2(Launch a new career) section ends */



/* section-3(Degree Programs) section start */



/* section-3(Degree Programs) section ends */




/* section-4(Courses and Professional Certificates) section start */



/* section-4(Courses and Professional Certificates) section ends */




/* section-5(100% Free) section start */



/* section-5(100% Free) section ends */



/* Section-6(Explore Coursera)  section start */
let vis_grid=document.querySelector(".vis_grid")
let gridgetdata=async()=>{
    let data= await fetch("https://jsonplaceholder.typicode.com/photos")
    let ndata=await data.json();
    console.log(ndata)
    showdata(ndata)
    

}
gridgetdata()
let showdata=(arr)=>{
    vis_grid.innerHTML=null
    arr.forEach(ele => {
        let card=document.createElement("div")
        card.className="vis_cardall"
        card.style.border="1px solid red"
        card.innerHTML=`
        <div id="vis_emage">
        <img src="${ele.thumbnailUrl}">
        </div>
        
        <div id="vis_subpart">
        <p>${ele.title}</p>
        <p>${ele.id}</p>
        </div>
        `
        vis_grid.append(card)
    });
   

}




/* Section-6(Explore Coursera)  section ends */




/* section-7(World-class learning)  section start */



/* section-7(World-class learning)  section ends */


/* section-8(From the Coursera community)  section start */


/* section-8(From the Coursera community)  section ends */






/* section-9(The ideal solution for your business)  section start */


/* section-9(The ideal solution for your business)  section ends */



/* section-10(Take the next step)  section start */


/* section-10(Take the next step)  section ends */



/* section-11(Footer)  section start */


/* section-11(Footer)  section ends */