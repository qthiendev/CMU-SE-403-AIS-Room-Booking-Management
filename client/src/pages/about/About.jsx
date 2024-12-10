import './About.css';
const About = () => {
    return (
        <>
            <section id="about-info" class="bg-light py-3">
                <div class="container">
                    <div class="info-left">
                        <h1 class="l-heading"><span class="text-primary">
                            About</span> Hotel AR</h1>
                        <p>Lorem ipsum dolor sit amet consectetur
                            adipisicing elit. Repudiandae omnis doloribus
                            officia dolorem alias ipsam numquam hic non ab.
                            Ut sint eveniet tempora delectus maxime est veniam,
                            praesentium voluptas aperiam.</p>
                        <p>Lorem ipsum dolor sit amet consectetur
                            adipisicing elit. Architecto, sit dicta nam
                            omnis quas mollitia perspiciatis libero.
                            Asperiores, modi quaerat.</p>
                    </div>
                    <div class="info-right">
                        <img src="../../../public/img/img2.jpg" alt="hotel" />
                    </div>
                </div>
            </section>
            <div class="clr"></div>

            <section id="testimonials" class="py-3">
                <div class="container"/>
                    <h2 class="l-heading">What Our Guests Say</h2>
                    <div class="testimonial bg-primary">
                        <img src="../../../public/img/img4.jpg" alt="Samantha"/>
                            <p>Lorem ipsum dolor sit amet consectetur
                                adipisicing elit. Modi iste, accusantium
                                vero, dolor atque, quia dignissimos eum
                                corporis consequuntur ut distinctio
                                voluptates! Architecto quia sequi eveniet,
                                voluptate, repellat neque voluptatibus excepturi
                                illo cupiditate nisi veritatis sit, reiciendis
                                earum! Possimus, explicabo?</p>
                    </div>
                    <div class="testimonial bg-primary">
                        <img src="../../../public/img/img6.jpg" alt="Rubina"/>
                            <p>Lorem ipsum dolor sit amet consectetur
                                adipisicing elit. Necessitatibus ut nostrum
                                aut non repellat quaerat illum animi inventore
                                amet quis autem, nemo nam minima accusamus blanditiis
                                explicabo cum? Assumenda possimus eveniet omnis rerum
                                illum? Rem laudantium iure dolorum illo asperiores!</p>
                    </div>
            </section>
            <footer id="main-footer">
                Hotel AR &copy; 2020, All Rights Reserved
              </footer>
        </>
    )
}

export default About;