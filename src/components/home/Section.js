import './Section.css';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import emoji from 'emoji-dictionary';



const markdown = `
### :mag_right: About Me
- Bachelor's Degree at Kumoh National Institute Of Technology(2012~2020)
- .NET Developer(Mostly WPF) 
### :computer: Career
- GERI: 2020.08 ~ 2021.08
- 4DReplay: 2021.12 ~ Current
### :bookmark_tabs: In Progress, Interested In
- Modern C++
- GPGPU
- Image Processing
- WPF
- Front-End, etc.
### :iphone: Account
- [Github](https://github.com/ironhiro)
- [LinkedIn](https://www.linkedin.com/in/%EC%9A%A9%ED%98%84-%EC%A1%B0-16b6a618b/)
- [Email](mailto:yhcho@4dreplay.com) 
- [Twitter](https://twitter.com/ironhiro1)

`
const emojiSupport = markdown.replace(/:(\w+):/gi, name => emoji.getUnicode(name));


function Section()
{
    return (
        <div className="container mt-5 mb-5">
            <img className="profile mb-5" src={process.env.PUBLIC_URL + "/assets/profile.jpg"} alt="avatar"/>
            <ReactMarkdown
                    children={emojiSupport}
                    remarkPlugins={[remarkGfm]}/>
        </div>
    );
}

export default Section;