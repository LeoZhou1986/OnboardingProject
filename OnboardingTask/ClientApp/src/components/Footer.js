import React,{ Component }from "react";
import { Container} from "semantic-ui-react";

export class Footer extends Component {
    displayName = Footer.name
    render() {
        return (
            <Container>
                ©2019-Leo Zhou
            </Container>
        );
    }
}