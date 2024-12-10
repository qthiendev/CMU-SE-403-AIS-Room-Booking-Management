const Contact = () => {
    return (
        <>
            <section id="contact-form" class="py-3">
                <div class="container">
                    <h1 class="l-heading">
                        <span class="text-primary">Contact</span> Us</h1>
                    <p>Please fill out the form below to contact us</p>
                    <form action="process.php">
                        <div class="form-group">
                            <label for="name">Name</label>
                            <input type="text" name="name" id="name" />
                        </div>
                        <div class="form-group">
                            <label for="email">Email</label>
                            <input type="text" name="email" id="email" />
                        </div>
                        <div class="form-group">
                            <label for="message">Message</label>
                            <textarea name="message" id="message"></textarea>
                        </div>
                        <div class="form-group">
                            <button type="submit" class="btn">Submit</button>
                        </div>
                    </form>
                </div>
            </section>

            <section id="contact-info" class="bg-dark">
                <div class="container">
                    <div class="box">
                        <i class="fas fa-hotel fa-3x"></i>
                        <h3>Location</h3>
                        <p>Sector 62, Noida (U.P.)</p>
                    </div>
                    <div class="box">
                        <i class="fas fa-phone fa-3x"></i>
                        <h3>Phone Number</h3>
                        <p>(91)-8888-8888</p>
                    </div>
                    <div class="box">
                        <i class="fas fa-envelope fa-3x"></i>
                        <h3>Email Address</h3>
                        <p>ARhotel@lux.co</p>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Contact;