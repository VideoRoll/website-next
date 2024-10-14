import React from "react";
// import { motion } from "framer-motion";
import Navbar from "../components/ui/NavBar";
import { Container, Text } from "@mantine/core";
import * as motion from "framer-motion/client";
import { getUserServerSideProps } from "../utils/auth-helpers/props";
import classes from "./Page.module.css";

export default async function Page() {
  const { currentUser } = await getUserServerSideProps();
  return (
    <div>
      <Navbar currentUser={currentUser}></Navbar>
      <Container size="lg">
        <section id="hero">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div>
              <div>
                <h1 className={classes.bannerTitle}>
                  <Text
                    className={classes.bannerTitle}
                    fw={900}
                    variant="gradient"
                    gradient={{
                      from: "rgba(212, 112, 255, 1)",
                      to: "violet",
                      deg: 90,
                    }}
                  >
                    All-in-one video enhancements
                  </Text>
                  in your browser
                </h1>
                <p className={classes.bannerDes}>
                  Easily enhance your video watching experience
                </p>
              </div>
              <div>
                <div>10K+</div>
              </div>
            </div>
          </motion.div>
        </section>
      </Container>
    </div>
  );
}
