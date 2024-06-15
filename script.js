/* Navbar section start */




/* Navbar section ends */




/* Expand your horizons section start */



/* Expand your horizons section ends */




/* Section1(We collaborate with ) section start */




/* Section1(We collaborate with ) section ends */




/* Section-2(Launch a new career) section start */




/* Section-2(Launch a new career) section ends */



/* section-3(Degree Programs) section start */

let data;
    let K1Cards = document.querySelector(".K1Cards");
    let K2Cards = document.querySelector(".K2Cards")
    let K3Cards = document.querySelector(".K3Cards")
    let K4Cards = document.querySelector(".K4Cards")
    let showMore = document.querySelector(".showMore");
    let screenWidth = window.innerWidth;

    let showData = (arr, condition, div) => {
      K1Cards.innerHTML = "";
      arr.forEach((ele, i) => {
        if (condition > i) {
          let K1Card = document.createElement("div");
          K1Card.className = "K1Card";

          let titleImg = document.createElement("div");
          titleImg.className = "example12";
          titleImg.style.backgroundImage = `url(${ele.img})`;

          let uni = document.createElement("div");
          uni.className = "uni";

          let uniLogo = document.createElement("img");
          uniLogo.src = ele.uniLogo;

          let uniName = document.createElement("p");
          uniName.textContent = ele.uniName;

          uni.append(uniLogo, uniName);

          let degreeName = document.createElement("p");
          degreeName.innerHTML = `<p style="margin-bottom: 10px">
              <b>${ele.degree}</b>
            </p>`;

          let earnDegree = document.createElement("div");
          earnDegree.className = "earnDegree";

          let templateIcon = document.createElement("span");
          templateIcon.className = "material-symbols-outlined";
          templateIcon.textContent = ele.templateIcon;

          let template = document.createElement("p");
          template.innerHTML = `<a href="${ele.templateHref}">${ele.template}</a>`;

          earnDegree.append(templateIcon, template);

          let title = document.createElement("p");
          title.textContent = ele.title;

          K1Card.append(titleImg, uni, degreeName, earnDegree, title);
          if(div == "uni1"){
            K1Cards.append(K1Card);
          } else if(div == "uni2"){
            K2Cards.append(K1Card);
          } else if(div == "cousera"){
            K3Cards.append(K1Card);
          } else if(div == "learning"){
            K4Cards.append(K1Card);
          }
          console.log(screenWidth);
        }
      });
    };
    let sd = () => {
        showMore.textContent = "Show 8 more"
      let viewportWidth = window.innerWidth;
      console.log("Viewport Width:", viewportWidth);

      if (viewportWidth <= 600) {
        K = 1;
        showData(data, K, "uni1");
      } else if (viewportWidth <= 1023) {
        K = 2;
        showData(data, K, "uni1");
      } else {
        K = 4;
        showData(data, K, "uni1");
      }
    };

    let K = 4;

    window.addEventListener("resize", () => {
      sd();

    });

    

    let handleShowMore = async () => {
      if (showMore.textContent == "Show 8 more") {
        K += 8;
        await showData(data, K, "uni1");
        if (K < data.length) {
          showMore.textContent = `Show ${data.length-K} more`;
        } else {
          showMore.textContent = "Show fewer";
        }
      } else if (showMore.textContent == "Show fewer") {
        await sd();
        showMore.textContent = "Show 8 more";
      } else {
        K += 8;
        await showData(data, K, "uni1");
          showMore.textContent = "Show fewer";
      }
    };
    showMore.addEventListener("click", () => {
      handleShowMore();
    });
    let data2;
let data3;
let data4;
    let getData = async(endPoint) => {
      let res =  await fetch (`http://localhost:3000/${endPoint}`);
      let ans = await res.json();
      

      if(endPoint == "Universities"){
        data = ans
        showData(data, K);
      } else if(endPoint == "Universities2"){
        data2 = ans
        showData2(data, K);
      } else if(endPoint == "coursera"){
        data3 = ans
        showData3(data, K);
      }  else if(endPoint == "learning"){
        data4 = ans
        showData4(data, K);
      } 
      
    }
    getData("Universities");

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