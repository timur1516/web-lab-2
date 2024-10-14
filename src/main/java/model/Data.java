package model;

import java.util.ArrayList;
import java.util.List;

public class Data {
    private final List<PointBean> data = new ArrayList<>();

    public List<PointBean> getData() {
        return data;
    }

    public void addRPoint(PointBean point) {
        data.add(point);
    }
}
