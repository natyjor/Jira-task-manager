
(function mainFunction(){
        console.log(localStorage.getItem("profile"));
        let storageProfileString = localStorage.getItem("profile");
        let savedProfile = JSON.parse(storageProfileString);
        document.querySelector(".title").innerHTML=savedProfile.title;
        document.querySelector(".task-type").innerHTML=savedProfile.taskType;
        document.querySelector(".tag").innerHTML=savedProfile.tag;
        document.querySelector(".priority").innerHTML=savedProfile.priority;
        document.querySelector(".description").innerHTML=savedProfile.description;
    })();